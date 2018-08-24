# Alustavaa dokumentointia

```
  client/
  ├── actions.js - Pitää sisällään Redux actionit
  ├── api.js - Apufunktiot serverin kanssa kommunikointia varten
  ├── containers
  │   ├── BarView.jsx - Sisältää näkymän, jossa oluttyyppi, vahvuus, koko yms. valitaan
  │   ├── IndexView.jsx - Etusivu, joka näkyy defaulttina. Renderöi statistiikkakomponentin (Stats.jsx)
  │   ├── LoginView.jsx - Näytetään, kun käyttäjä ei ole vielä valinnut nimeä. Jatkossa varmaan FB-kirjautuminen?
  │   ├── Root.jsx - Juurikomponentti. Renderöi applikaation tilaa vastaavan komponentin (yllä mainitut)
  │   └── Stats.jsx - Statistiikkakomponentti. Laskee ja näyttää statistiikkataulukon.
  ├── index.html - Template HTML, johon skriptit ja tyylit injektoidaan (Webpackin plugari hoitaa injektoinnin)
  ├── index.jsx - Initialisoi koko applikaation, webpackin entry point
  ├── reducer.js - Sisältää Reduxin reducerin
  ├── routes.js - Sisältää routerin conffit
  └── styles
      └── main.scss - Kustomit tyylittelyt
```