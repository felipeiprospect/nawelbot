// Inicializamos las librerias
const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path');
var moment = require('moment-timezone');
var time2 = moment().tz("America/Santiago").format();
var time = time2.replace(/https:|www.|.cl|[/]|http:|[.]|[_]|aspx/g, "");
var fecha = time.substring(0, 10);
var hora = time.split("T", 2)[1].substring(0, 5);
const lighthouse = require('lighthouse');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');


return new Promise(async (resolve, reject) => {
  // Representa una función asíncrona que ejecuta el código contenido dentro de la función.
  (async () => {
    //Se crea un navegador cuando Puppeteer se conecta a una instancia
    const browser = await puppeteer.launch({

      //Los argumentos los vamos a revisar en más detalle en la sesión 2
      args: ['--no-sandbox', '--disable-setuid-sandbox', "--disable-gpu", '--start-maximized'],
      ignoreHTTPSErrors: true,
      //false inicia con navegador - true inicia sin navegador
      headless: false,
      // espera a que se cargue toda la página
      waitUntil: 'networkidle2'
    });

    // Genera una nueva pestaña dentro del Navegador
    const page = await browser.newPage();

    // Abre una url en el navegador
    await page.goto('https://www.iprospect.com/es/cl/about-us/our-team/', {
      timeout: 100000
    })

    // Tamaño de la ventana
    await page.setViewport({
      width: 1280,
      height: 800
    })

    // CLIC Botón Aceptar Cookie si es que se despliega
    botonCookie = 'button.cookie-banner__button.cookie-banner__button--accept.typography-body.typography-heavy.accept';
    if (await page.$(botonCookie) !== null) {
      await page.waitForSelector(botonCookie);
      await page.click(botonCookie);
      console.log("aceptar cookies");
    }


    //const cookies = await page.cookies()



    await lhjson(page.url(), "desktop");
    await lhjson(page.url(), "mobile");


    // CLIC Botón menú Servicios
    botonServicios = 'img.header__logo-desktop';
    navigationPromise = page.waitForNavigation();
    await page.waitForSelector(botonServicios);
    await page.click(botonServicios);
    await navigationPromise; // The navigationPromise resolves after navigation has finished

    console.log("se fue el lanchón");
    await lhjson(page.url(), "desktop");
    await lhjson(page.url(), "mobile");

    //Función que ejecuta una captura de pantalla
    await page.screenshot({
      path: 'homeIprospect.png',
      fullPage: true
    });

    //Cierra el navegador
    browser.close();
  })();






  async function lhjson(url, dispositivo, cookies) {

    res = url.replace(/https:|www.|.cl|[/]|http:|[.]|[_]|[#]|aspx/g, "");
    Newfecha = fecha.replace(/https:|www.|.cl|[/]|http:|[.]|[:]|[_]|[#]|aspx/g, "");
    Newhora = hora.replace(/https:|www.|.cl|[/]|http:|[.]|[:]|[_]|[#]|aspx/g, "");

    console.log(url);
    console.log(dispositivo);
    console.log(Newfecha);
    console.log(Newhora);
    console.log(res);
    const browser = await puppeteer.launch({
      headless: false,
      waitUntil: 'networkidle2',
      timeout: 2000000,
      args: ['--no-sandbox', '--ignore-certificate-errors', "--disable-gpu"]
    })

    const page = await browser.newPage()
    await page.setViewport({
      width: 1280,
      height: 800
    })
    await page.goto(url, {
      timeout: 2000000
    })

    //await page.setCookie.apply(page, cookies);

    const {
      lhr
    } = await lighthouse(url, {
      port: (new URL(browser.wsEndpoint())).port,
      output: 'json',
      logLevel: 'info',
      ["emulated-form-factor"]: dispositivo
    });

    const json = reportGenerator.generateReport(lhr, 'json');


    var parsejson = JSON.parse(json);

    let firstContentfulPaint_numericValue = parsejson.audits["first-contentful-paint"] ? parseFloat((parsejson.audits["first-contentful-paint"].numericValue / 1000).toFixed(2)) : 0;
    let speedIndex_numericValue = parsejson.audits["speed-index"] ? parseFloat((parsejson.audits["speed-index"].numericValue / 1000).toFixed(2)) : 0;
    let largestContenfulPaint_numericValue = parsejson.audits["largest-contentful-paint"] ? parseFloat((parsejson.audits["largest-contentful-paint"].numericValue / 1000).toFixed(2)) : 0;
    let interactive_numericValue = parsejson.audits.interactive ? parseFloat((parsejson.audits.interactive.numericValue / 1000).toFixed(2)) : 0;
    let totalBlockingTime_numericValue = parsejson.audits["total-blocking-time"] ? parseFloat((parsejson.audits["total-blocking-time"].numericValue / 1000).toFixed(2)) : 0;
    let cumulativeLayoutShift_numericValue = parsejson.audits["cumulative-layout-shift"] ? parseFloat((parsejson.audits["cumulative-layout-shift"].numericValue / 1000).toFixed(2)) : 0;
    let Performance_score = parsejson.categories.performance ? parsejson.categories.performance.score || 0.01 : 0;
    let Accessibility_score = parsejson.categories.accessibility ? parsejson.categories.accessibility.score || 0.01 : 0;
    let bestPractices_score = parsejson.categories["best-practices"] ? parsejson.categories["best-practices"].score || 0.01 : 0;
    let SEO_score = parsejson.categories.seo ? parsejson.categories.seo.score || 0.01 : 0;


    let json1 = {
      "url": url,
      "Fecha": fecha,
      "Hora": hora,
      "Dispositivo": dispositivo,
      "detalleHTML": `https://storage.cloud.google.com/hdi-flujosegurodeautos-html/${res}_${Newfecha}_${Newhora}_${dispositivo}.html`,
      "detalleJSON": `https://storage.cloud.google.com/hdi-flujosegurodeautos/${res}_${Newfecha}_${Newhora}_${dispositivo}.json`,
      "firstContentfulPaint_numericValue": firstContentfulPaint_numericValue,
      "speedIndex_numericValue": speedIndex_numericValue,
      "largestContenfulPaint_numericValue": largestContenfulPaint_numericValue,
      "interactive_numericValue": interactive_numericValue,
      "totalBlockingTime_numericValue": totalBlockingTime_numericValue,
      "cumulativeLayoutShift_numericValue": cumulativeLayoutShift_numericValue,
      "Performance_score": Performance_score,
      "Accessibility_score": Accessibility_score,
      "bestPractices_score": bestPractices_score,
      "SEO_score": SEO_score
    }

    let json2 = JSON.stringify(json1);
    console.log(json2);

    const html = reportGenerator.generateReportHtml(lhr);


    console.log(`${res}_${Newfecha}_${Newhora}_${dispositivo}_.json`);


    const writeJson = await fs.writeFileSync(`${res}_${Newfecha}_${Newhora}_${dispositivo}.json`, json, (err) => {
      if (err) {
        console.error(err);
      }
    });

    const writeJsonResumen = await fs.writeFileSync(`${res}_${Newfecha}_${Newhora}_${dispositivo}_resumen.json`, json2, (err) => {
      if (err) {
        console.error(err);
      }
    });

    const writeHtml = await fs.writeFileSync(`${res}_${Newfecha}_${Newhora}_${dispositivo}.html`, html, (err) => {
      if (err) {
        console.error(err);
      }
    });

    await browser.close();

  }

  const timeout = millis => new Promise(resolve => setTimeout(resolve, millis));

});

resolve();
