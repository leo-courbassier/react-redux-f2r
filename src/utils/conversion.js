export function datesFromISO(list, name){
  // used to convert date format from picker (2016-05-04T16:00:00.000Z)
  // to "2016-05-04" and the like

  for(let prop in list){
    if (prop == name){
      list[prop] = list[prop].split("T")[0];
    }
  }
  return list;

}

export function dateFromISO(date){
  return date.split("T")[0];
}

export function datesToISO(list, name){
  for(let prop in list){
    if (prop == name){
      list[prop] = new Date(list[prop]).toISOString();
    }
  }
  return list;
}

export function dateToISO(date){
  return new Date(date).toISOString();
}

export function urlToHttps(url){
  if(url){
    return url.replace('http://', 'https://');
  }
  return url;
}
