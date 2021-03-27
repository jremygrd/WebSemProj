# Web Datamining and Semantics Project
Jérémy Gourdeau
Antoine Hazart
Thomas Isla

## Instalation:

First clone the project using:

```git clone https://github.com/jremygrd/WebSemProj.git```

Then initiate and run the project usig: 

```npm install```
and
```npm run dev```

The project is now running on ```http://localhost:3000```.

Start the JENA server (launch the .bat file)

Go to http://localhost:3000

Data will start being fetched as soon as you go on the page

![image](https://user-images.githubusercontent.com/73878811/112719104-4fb10680-8ef7-11eb-8d20-a68a162208de.png)

## How to use:

You can move on the map and press the button at the selected area to get the list of the closest bicycle stations. it displays pins where the stations are.
You get the number of bicycles availiable at each station. You also get the current temperature. 
You can click on an pin to get the station's information.

On the left of your screen, they is a list of all the stations close to you, sorted by distance. 

On the top right of the web page, you can select the city where you want to be teleported to. 

![image](https://user-images.githubusercontent.com/73878811/112719136-8edf5780-8ef7-11eb-8c69-38640672d1dc.png)


## In details :

When loading the page, NextJS will execute the content of the getInitialProps function (in app.js)
In this function we just call the api page.

In there (/api/hello.js), We firstly fetch the data

Then We create the Json-LD format in the myjson const :
![image](https://user-images.githubusercontent.com/73878811/112719242-45dbd300-8ef8-11eb-9987-77a6671ff6f2.png)

Then we clear the graph, to delete everything that was already in the database (to avoid creating duplicates when refetching)

![image](https://user-images.githubusercontent.com/73878811/112719272-6f94fa00-8ef8-11eb-8ab9-2611032e0156.png)

And finally we can upload the latest data we just fetched

![image](https://user-images.githubusercontent.com/73878811/112719285-7f144300-8ef8-11eb-9dd7-3c889cd86d27.png)



Now in the Map.js component, when clicking on the bottom left button on the page, we will execute a Sparql query to ask the database the stations near us :

![image](https://user-images.githubusercontent.com/73878811/112719323-b256d200-8ef8-11eb-9276-1ee65d9bd368.png)

The response is then stored into hooks so we will be able to display the stations on the map
