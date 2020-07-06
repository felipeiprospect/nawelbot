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
    headless: false
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

  //Función que ejecuta una captura de pantalla
  await page.screenshot({
    path: 'google.png',
    fullPage: true
  });

  //Cierra el navegador
  browser.close();
})();
