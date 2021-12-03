# nodesahbot Nodejs app


Example using

`node index.js car=egea`

If you would to add a new filter for cars, you could change the filter.js file.

Example for citroen c3 

filter.js
````JS

getc3Filter(){
return [
"citroen-c3?a5_min=2012&a5_max=2012&sorting=price_asc",
"citroen-c3?a5_min=2013&a5_max=2013&sorting=price_asc"
];
}
````

using with c3 
`node index.js car=c3`
