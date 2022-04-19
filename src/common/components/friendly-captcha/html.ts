export default `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Captch</title>
  </head>
  <body style="background-color: transparent">
    <div id="captcha"></div>
  </body>
  <script
    type="module"
    src="https://unpkg.com/friendly-challenge@0.9.1/widget.module.min.js"
  ></script>
  <script
    nomodule
    src="https://unpkg.com/friendly-challenge@0.9.1/widget.min.js"
  ></script>
  <script>
    function postMessage(data) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data))
    }

    document.addEventListener('DOMContentLoaded', function (event) {
      try {
        new friendlyChallenge.WidgetInstance(
          document.getElementById('captcha'),
          {
            startMode: 'auto',
            // sitekey: 'FCMNS7BU7R8316DQ',
            sitekey: 'minds-front',
            puzzleEndpoint:
              'https://feat-friendly-captcha-2272.minds.io/api/v3/friendly-captcha/puzzle',
            doneCallback: solution => {
              postMessage({ solution });
            },
            errorCallback: error => {
              postMessage({ error });
            },
          },
        );
      } catch (error) {
        postMessage({ error });
      }
    });
  </script>
</html>`;
