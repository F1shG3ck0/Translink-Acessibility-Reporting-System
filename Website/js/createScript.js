// Send an SQL query to dbConnector.php and return the JSON response.
const runQuery = async (sql) => {
  try {
    // This is the PHP endpoint that talks to the database for us.
    //CHANGE THE PHP ENDPOINT
    const url = "./dbFiles/dbConnector.php";

    // Send the SQL statement in the body of a POST request.
    const response = await fetch(url, {
      method: "POST",
      body: new URLSearchParams({ query: sql }),
    });

    // Stop and report a problem if the web request itself failed.
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    // Convert the JSON text from PHP into a JavaScript object.
    const result = await response.json();
    //console.log(JSON.stringify(result));
    return result;
  } catch (error) {
    // Log errors so they can be seen in the browser console during debugging.
    //console.log(error.message);
  }
};

// Trip Validation - Niamh (40484338)
const validateTrip = (trip) => {
  if (!trip || typeof trip !== "object") {
    return "Trip details are required";
  }

  const routeID = Number(trip.routeID);
  const vehicleID = Number(trip.vehicleID);
  const operatorID = Number(trip.operatorID);
  const departureStr = typeof trip.scheduledDeparture === "string" ? trip.scheduledDeparture.trim() : "";
  const arrivalStr = typeof trip.scheduledArrival === "string" ? trip.scheduledArrival.trim() : "";

  const rCat = typeof trip.routeCat === "string" ? trip.routeCat.trim() : "";
  const oCat = typeof trip.operatorCat === "string" ? trip.operatorCat.trim() : "";
  const vCat = typeof trip.vehicleCat === "string" ? trip.vehicleCat.trim() : "";

  if (!routeID || routeID < 1) return "A valid Route selection is required.";
  if (!operatorID || operatorID < 1) return "A valid Operator selection is required.";
  if (!vehicleID || vehicleID < 1) return "A valid Vehicle selection is required.";

  if (!departureStr) return "Scheduled Departure is required.";
  if (!arrivalStr) return "Scheduled Arrival is required.";

  const departureDate = new Date(departureStr);
  const arrivalDate = new Date(arrivalStr);
  const now = new Date(); // Get the current date and time

  if (departureDate <= now) {
    return "The Scheduled Departure must be in the future.";
  }

  if (departureDate >= arrivalDate) {
    return "The Scheduled Departure must be earlier than the Scheduled Arrival.";
  }

  if (!rCat || !oCat || !vCat) {
    return "Service type detection failed. Please re-select the route, operator, and vehicle.";
  }

  if (rCat !== oCat || oCat !== vCat) {
    return `Service Mismatch: You have selected a ${rCat} route, a ${oCat} operator, and a ${vCat} vehicle. All three must be the same type (Bus or Train).`;
  }

  return ""; 
};

// Check that a Stop object contains valid values before using it in SQL.
// Rosa Madden - 40473004
const validateStop = (stop) => {
  if (!stop || typeof stop !== "object") {
    return "Stop details are required.";
  }

  // Clean up and convert values first so the checks below are easier to write.
  const stopName =
    typeof stop.stopName === "string" ? stop.stopName.trim() : "";
  const stopType =
    typeof stop.stopType === "string" ? stop.stopType.trim() : "";

  // Check each field one at a time and return the first message that applies.
  if (!stopName) {
    return "Stop name is required.";
  };

  if (stopName.length > 255) {
    return "Stop name must be 255 characters or fewer.";
  };
  //no special characters allowed in stop name, only letters, numbers and spaces.
  if (!/^[a-zA-Z0-9\s]+$/.test(stopName)) {
    return "Stop name must only contain letters, numbers, and spaces.";
  };

  if (!stopType) {
    return "Stop type is required.";
  };

  if (
    stopType !== "Bus Stop" &&
    stopType !== "Train Station" &&
    stopType !== "Bus & Train Station" &&
    stopType !== "Buscentre"
  ) {
    return "Stop type must be selected from the drop down menu.";
  };

  // An empty string means every check passed.
  return "";
};

validateNewStop = async(stop) => {
  const stopName =
    typeof stop.stopName === "string" ? stop.stopName.trim() : "";
  const sql = `
        SELECT 1 
        FROM tblStop 
        WHERE LOWER(stopName) = LOWER('${escapeSql(stopName)}')
        LIMIT 1;`;

  const result = await runQuery(sql);
 
  if (result && result.affected_rows > 0) {
    return "This stop already exists.";
  }
  return "";
};

// Check that a RouteStop object contains valid values before using it in SQL.
// Rosa Madden - 40473004
const validateRouteStop = async (routeStop) => {
  //final validation should never be able to fail due to previous validation
  if (!routeStop || typeof routeStop !== "object") {
    return "Route stop details are required.";
  };

  // Clean up and convert values first so the checks below are easier to write.
  const routeId = Number(routeStop.routeId);
  const stopId = Number(routeStop.stopId);

  if (!routeId) {
    return "Route ID is required.";
  };

  if (!stopId) {
    return "Stop ID is required.";
  };

  const sql = `
        SELECT 1 
        FROM tblRouteStop 
        WHERE routeId = ${routeStop.routeId}
        AND stopId = ${routeStop.stopId}
        LIMIT 1;
    `;

  const result = await runQuery(sql);

  if (result && result.affected_rows > 0) {
    return "This stop already exists.";
  }

  // An empty string means every check passed.
  return "";
};

//Lucia's JS for Create Operator - 40477087
const validateOperator = (operator) => {
  if (!operator || typeof operator !== "object") {
    return "Operator details are required.";
  }

  const first =
    typeof operator.operatorFirstName === "string"
      ? operator.operatorFirstName.trim()
      : "";
  const last =
    typeof operator.operatorLastName === "string"
      ? operator.operatorLastName.trim()
      : "";
  const service =
    typeof operator.serviceType === "string" ? operator.serviceType.trim() : "";
  const email = typeof operator.contactEmail === "string"
      ? operator.contactEmail.trim()
      : "";

  if (!first) {
    return "First name is required.";
  }
 if (first.length < 2) {
    return "First name must be 2 characters or more.";
  }

  if (!/^[a-zA-Z\s]+$/.test(first)) { 
    return "First name must only contain letters and spaces.";
}
  if (first.length > 15) {
    return "First name must be 15 characters or fewer.";
  }
  if (!first) {
    return "First name is required.";
  }
   if (!last) {
    return "Surname is required.";
  }

  if (last.length < 2) {
    return "Surname must be 2 characters or more.";
  } 
   if (!/^[a-zA-Z\s]+$/.test(last)) { 
    return "Surname must only contain letters and spaces.";
  }
  if (last.length > 20) {
    return "Surname must be 20 characters or fewer.";
  }
 
  if (!last) {
    return "Surname is required.";
  }

  if (!service) {
    return "Please select a service type.";
  }
  if (!email) {
    return "Email is required.";
  }

  if (!email.includes("@") || !email.includes(".")) {
    return "Please enter a valid email address.";
  }

  if (!email.endsWith("@translink.co.uk")) {
    return "Email must be a valid Translink email.";
  }

  // An empty string means every check passed.
  return "";
};
//Lucia's JS for CreateVehicle -40477087
const validateVehicle = (vehicle) => {
  if (!vehicle || typeof vehicle !== "object") {
    return "Vehicle details are required.";
  }

  // 1. Clean up and convert values
  const vehicleType = vehicle.vehicleType;
  const vehicleCapacity = Number(vehicle.maxCapacity);

  if (!vehicleType) {
    return "Please select a vehicle type.";
  }

  if (isNaN(vehicleCapacity)) {
    return "Maximum capacity must be a number.";
  }

  if (vehicleCapacity < 1) {
    return "Maximum capacity must be a positive number.";
  }

  if (vehicleCapacity > 1000) {
    return "Maximum capacity cannot exceed 1000.";
  }

  if (vehicleCapacity < 40) {
    return "Vehicle must carry at least 40 passengers.";
  }

  return "";
};
//Lucia's JS for updateComplaint -40477087
const validateComplaintUpdate = (resolved) => {
  if (Number(resolved) === 0) {
    return "Please change the resolved status before updating.";
  }
  return "";
};

//end of lucia's validation



 const showMessage = (text, type) => {
      const output = document.querySelector("#output");
      output.textContent = text;
      output.className = `message ${type}`;
      output.style.display = "block";
      if (output.timeoutId) {
        clearTimeout(output.timeoutId);
      }
      output.timeoutId = setTimeout(() => {
        output.style.display = "none";
        output.className = "message";
      }, 6000);
    };
    
    //create feature - mary
const validateFeature = (feature) => {
  if (!feature || typeof feature !== "object") {
    return "Feature details are required.";
  }

  const featureName =
    typeof feature.featureName === "string" ? feature.featureName.trim() : "";
  const featureCategory =
    typeof feature.featureCategory === "string" ? feature.featureCategory.trim() : "";

  if (!featureName) {
    return "Feature name is required.";
  }

  if (featureName.length > 50) {
    return "Feature name must be 50 characters or less.";
  }

  if (!/^[a-zA-Z\s]+$/.test(featureName)) {
    return "Feature name must only contain letters and spaces.";
  }

  if (!featureCategory) {
    return "Feature category is required.";
  }

  if (featureCategory !== "Vehicle" && featureCategory !== "Stop") {
    return "Feature category must be selected from the drop-down menu.";
  }

  return null;
};


const featureForm = document.querySelector("#featureForm");

if (featureForm) {
  featureForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const feature = {
      featureName: document.querySelector("#featureName").value.trim(),
      featureCategory: document.querySelector("#featureCategory").value.trim()
    };

    const validationMessage = validateFeature(feature);
    if (validationMessage) {
      showMessage(validationMessage, "error");
      return;
    }

    const insertSql = `
      INSERT INTO tblFeature (featureName, featureCategory)
      SELECT
        '${escapeSql(feature.featureName)}',
        '${escapeSql(feature.featureCategory)}'
      WHERE NOT EXISTS (
        SELECT 1
        FROM tblFeature
        WHERE TRIM(featureName) = '${escapeSql(feature.featureName)}'
        AND TRIM(featureCategory) = '${escapeSql(feature.featureCategory)}'
      );
    `;

    const result = await runQuery(insertSql);
    console.log("Insert result:", result);

    if (result && Number(result.affected_rows) === 0) {
      showMessage(
        `A ${feature.featureCategory.toLowerCase()} feature with this name already exists.`,
        "error"
      );
      return;
    }

    if (result && result.success) {
      showMessage("Feature record added successfully.", "success");
      document.querySelector("#featureForm").reset();
      return;
    }

    if (result && result.error) {
      showMessage(result.error, "error");
    } else {
      showMessage("Unable to add the feature record.", "error");
    }
  });}





const validateRoute = (route) => {
  if (!route || typeof route !== "object") {
    return "Route details are required.";
  }

  const routeName =
    typeof route.routeName === "string" ? route.routeName.trim() : "";
  const startLocation =
    typeof route.startLocation === "string" ? route.startLocation.trim() : "";
  const endLocation =
    typeof route.endLocation === "string" ? route.endLocation.trim() : "";

  if (!routeName) {
    return "Route name is required.";
  }

  if (!startLocation) {
    return "Start location is required.";
  }

  if (!endLocation) {
    return "End location is required.";
  }

  if (routeName.length > 100) {
    return "Route name must be 100 characters or fewer.";
  }

  if (startLocation.length > 50) {
    return "Start location must be 50 characters or fewer.";
  }

  if (endLocation.length > 50) {
    return "End location must be 50 characters or fewer.";
  }

  const validCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 -";

  for (let char of routeName) {
    if (!validCharacters.includes(char)) {
      return "Route name contains invalid characters.";
    }
  }

  for (let char of startLocation) {
    if (!validCharacters.includes(char)) {
      return "Start location contains invalid characters.";
    }
  }

  for (let char of endLocation) {
    if (!validCharacters.includes(char)) {
      return "End location contains invalid characters.";
    }
  }

  return null;
};

//CREATE ROUTE FORM
//show feedback to the user after validation or database actions
const routeForm = document.querySelector("#routeForm");

if (routeForm) {
  routeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

 
    //prevent page refresh


    //gather the user input
    const route ={
        routeName: document.querySelector("#routeName").value.trim(),
        startLocation: document.querySelector("#startLocation").value.trim(),
        endLocation: document.querySelector("#endLocation").value.trim(),
        returnJourney: document.querySelector("#returnJourney").checked

    };

    //validation message
    const validationMessage = validateRoute(route);
    if(validationMessage){
        showMessage(validationMessage, "error");
        return;
    }


    //confirm submission to check if the user is wanting to add a train route
    const confirmTrain = confirm(
      "If this is a TRAIN route, please ensure the route name ends in 'Line'.\n\nClick OK to continue or CANCEL to go back and edit."
    );

if (!confirmTrain){
console.log("User cancelled form submission to edit the route input");
return;
}

//validation to prevent journey added again with exact same name, start and end
const checkComboSql =`
SELECT 1
 FROM tblRoute
WHERE routeName = '${escapeSql(route.routeName)}'
AND startLocation = '${escapeSql(route.startLocation)}'
AND endLocation ='${escapeSql(route.endLocation)}'

`;
const comboResult = await runQuery(checkComboSql);

if(comboResult && comboResult.length > 0){
  showMessage("A route with this name, start and end location already exists.","error");
  return;
}

//general explanation
//check that the returnJourney must have the same name
//no route can be added with the reverse of another route without having the same route  name

//check for reverse route name match
const reverseSql =`
SELECT * FROM tblRoute
WHERE startLocation = '${escapeSql(route.endLocation)}'
AND endLocation = '${escapeSql(route.startLocation)}'
`;

const reverseResult = await runQuery(reverseSql);

//check if a reverse route(return journey) exists, must have same name
if (reverseResult && reverseResult.length >0){

  const existingRoute = reverseResult[0];

  if(existingRoute.routeName !== route.routeName){
    showMessage(
      "A return journey already exists with a diffferent name. Route name must match",
      "error"
    );
    return;
  }
}


//insert main route
const insertSql = `
INSERT INTO tblRoute (routeName, startLocation, endLocation)
VALUES (
'${escapeSql(route.routeName)}',
'${escapeSql(route.startLocation)}',
'${escapeSql(route.endLocation)}'
);
`;

const result = await runQuery(insertSql);

if (!result || !result.success){
  showMessage("Error adding route, this route already exists.","error");
return;

}

//if returnJourney is ticked
if(route.returnJourney){

  const returnSql =`
  INSERT INTO tblRoute (routeName, startLocation, endLocation)
VALUES (
'${escapeSql(route.routeName)}',
'${escapeSql(route.endLocation)}',
'${escapeSql(route.startLocation)}'
);
`;

await runQuery(returnSql);

}
showMessage("Route added successfully", "success");
document.querySelector("#routeForm").reset();
});

}


// Replace single quotes with two single quotes so they are safer inside SQL strings
// /'/g means "find every single quote in the text" (g = global, so not just the first one)
//add filter to stop if undefined entered
const escapeSql = (value) => {
  if (value === null || value === undefined){
    return "";
  }
  return String(value).replace(/'/g, "''");
};

//RIONA'S CODE START

// prints an error message for invalid stopFeature records
const validateStopFeature = async (stopFeature) => {
  if (!stopFeature.stopId || !stopFeature.featureId) {
    return "Both stop and feature must be selected.";
  }

  const sql = `
        SELECT 1 
        FROM tblStopFeature 
        WHERE stopId = ${stopFeature.stopId}
        AND featureId = ${stopFeature.featureId};
    `;

  const result = await runQuery(sql);

  if (result && result.data && result.data.length > 0) {
    return "This stop already has that feature.";
  }

  return "";
};

// loads in all the stops from the database
const loadStops = async () => {
  const sql = "SELECT stopId, stopName FROM tblStop ORDER BY stopName;";
  const result = await runQuery(sql);

  const stopSearch = document.querySelector("#stopSearch");

  if (!result || !result.data) return;

  for (let row of result.data) {
    const option = document.createElement("option");
    option.value = row.stopId;
    option.textContent = row.stopName;
    stopSearch.appendChild(option);
  }
};

// loads in all the vehicle records from the database
const loadVehicle = async () => {
  const sql = "SELECT vehicleId, vehicleType FROM tblVehicle ORDER BY vehicleId;";
  const result = await runQuery(sql);

  const vehicleSelect = document.querySelector("#vehicleSelect");

  if (!result || !result.data) return;

  for (let row of result.data) {
    const option = document.createElement("option");
    option.value = row.vehicleId;
    option.textContent = row.vehicleId;
    vehicleSelect.appendChild(option);
  }
};

// loads in all the stop feature records from the database
const loadStopFeatures = async () => {
  const sql = "SELECT featureId, featureName FROM tblFeature WHERE featureCategory = 'Stop' ORDER BY featureName;";
  const result = await runQuery(sql);

  const featureSearch = document.querySelector("#featureSearch");

  if (!result || !result.data) return;

  for (let row of result.data) {
    const option = document.createElement("option");
    option.value = row.featureId;
    option.textContent = row.featureName;
    featureSearch.appendChild(option);
  }
};

// loads in all the vehicle feature records from the database
const loadVehicleFeatures = async () => {
  const sql = "SELECT featureId, featureName FROM tblFeature WHERE featureCategory = 'Vehicle' ORDER BY featureName;";
  const result = await runQuery(sql);

  const featureSearch = document.querySelector("#featureSearch");

  if (!result || !result.data) return;

  for (let row of result.data) {
    const option = document.createElement("option");
    option.value = row.featureId;
    option.textContent = row.featureName;
    featureSearch.appendChild(option);
  }
};

// prints error messages for invalid vehicleFeature records
const validateVehicleFeature = async (vehicleFeature) => {
  if (!vehicleFeature.vehicleId || !vehicleFeature.featureId) {
    return "Please select both a vehicle and a feature.";
  }

  const sql = `
        SELECT 1
        FROM tblVehicleFeature
        WHERE vehicleId = ${vehicleFeature.vehicleId}
        AND featureId = ${vehicleFeature.featureId};
    `;

  const result = await runQuery(sql);

  if (result && result.data && result.data.length > 0) {
    return "This vehicle already has that feature.";
  }

  return "";
};

// makes sure an email address (operator) does not appear more than once in the database
const validateUniqueEmail = async (email) => {
  if (!email || email.trim() === "") {
    return "Please enter an email address.";
  }

  const sql = `
        SELECT 1
        FROM tblOperator
        WHERE contactEmail = '${email.replace(/'/g, "''")}';
    `;

  const result = await runQuery(sql);

  if (result && result.data && result.data.length > 0) {
    return "This email is already registered.";
  }

  return "";
};

const validateStopFeatureDelete = (sf) => {
  if (!sf.stopId) return "Please select a stop.";
  if (!sf.featureId) return "Please select a feature.";
  return "";
};


//RIONA'S CODE END





