//Ausgelagerte Helferfunktionen


// Mit dieser Funktion wird überprüft ob der Prüfling 18 Jahre alt ist. Da diese mehrfach eingesetzt wird ausgelagert in helpers
export function calculateAge(geburtstag: string): boolean {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear(); //das aktuelle Jahr wird zurückgegeben und in der variable gespeichert
  const currentMonth = currentDate.getMonth() + 1; // Monate werden von 0 bis 11 gezählt, daher +1
  const currentDay = currentDate.getDate();

  const [birthDay, birthMonth, birthYear] = geburtstag.split('.'); //Tage, Monate und Jahr werden aufgesplittet in einzelne variablen, besser zum berechnen

  let ageYears = currentYear - parseInt(birthYear);

  // Überprüfen, ob der Geburtstag im aktuellen Jahr bereits stattgefunden hat
  if (
    currentMonth < parseInt(birthMonth) ||
    (currentMonth === parseInt(birthMonth) && currentDay < parseInt(birthDay))
  ) {
    ageYears--; // Reduziere das Alter um 1, wenn der Geburtstag noch nicht stattgefunden hat
  }

  if (ageYears < 18) {
    return false;
  }

  else {

    return true;
  }
};

// Funktion zum prüfen ob wert leer ist
export function isEmpty(value: string | undefined) {
  if(typeof value === undefined) {
    return false;
  }

  if(value != undefined) {
    return value.trim() === '';
  }
}

//funktion zum überprüfen ob objekte leere, undefined oder false werte enthalten, dient der form validierung
export function checkIfUndefined(obj: any) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key.includes('Bemerkung') || key.includes('beruf') || key.includes('kennzeichnungUAS')) {
        continue;
      }
      if (obj[key] === undefined || obj[key] === '' || obj[key] === false) {
        return true;
      }
    }
  }
  return false;
}