let facebookLoaded = false;
const facebookLoadListeners = [];

export function onceFacebookLoaded(fn) {
  if (facebookLoaded) {
    fn();
  } else {
    facebookLoadListeners.push(fn);
  }
}

window.fbAsyncInit = () => {
  FB.init({
    appId: '1805325732897696',
    cookie: true,
    xfbml: true,
    version: 'v3.1',
  });

  FB.AppEvents.logPageView();

  facebookLoaded = true;
  facebookLoadListeners.forEach(fn => fn());
};

/* eslint-disable */
(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));