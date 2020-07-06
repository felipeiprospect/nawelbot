// Inicializamos las librerias
const puppeteer = require('puppeteer');


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


  // CLIC Botón menú Servicios
  botonServicios = 'img.header__logo-desktop';
  navigationPromise = page.waitForNavigation();
  await page.waitForSelector(botonServicios);
  await page.click(botonServicios);
  await navigationPromise; // The navigationPromise resolves after navigation has finished

  console.log("se fue el lanchón");

  //Función que ejecuta una captura de pantalla
  await page.screenshot({
    path: 'homeIprospect.png',
    fullPage: true
  });

  //Cierra el navegador
  browser.close();
})();
