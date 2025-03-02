(function () {
  var DELIMITER = ",";
  var NEWLINE = "\n";
  var REQUIRED_HEADERS = ["Student Number", "Student Name", "Student Email"];
  var i = document.getElementById("file");
  var table = document.getElementById("table");

  if (!i || !table) {
    return;
  }

  // Create table headers initially
  createTableHeaders();

  i.addEventListener("change", function () {
    if (!!i.files && i.files.length > 0) {
      parseCSV(i.files[0]);
    }
  });

  function parseCSV(file) {
    if (!file || !FileReader) {
      return;
    }

    if (file.type !== "text/csv") {
      alert("Please upload a valid CSV file.");
      return;
    }

    var reader = new FileReader();

    reader.onload = function (e) {
      toTable(e.target.result);
    };

    reader.readAsText(file);
  }

  function toTable(text) {
    if (!text || !table) {
      return;
    }

    var rows = text.split(NEWLINE);
    var headers = rows
      .shift()
      .trim()
      .split(DELIMITER)
      .map((h) => h.trim().toLowerCase()); // Convert to lowercase for case-insensitive comparison

    if (!validateHeaders(headers)) {
      alert(
        "Invalid CSV headers. The file must contain: Student Number, Student Name, and Student Email.",
      );
      return;
    }

    // Clear table data but keep headers
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }

    rows.forEach(function (r) {
      r = r.trim();
      if (!r) return;

      var cols = r.split(DELIMITER).map((c) => c.trim());
      if (cols.length !== REQUIRED_HEADERS.length) return;

      var rtr = document.createElement("tr");
      cols.forEach(function (c) {
        var td = document.createElement("td");
        td.textContent = c;
        rtr.appendChild(td);
      });

      // Add an extra column for "Assign Student"
      var assignTd = document.createElement("td");
      var assignButton = document.createElement("button");
      assignButton.textContent = "Assign Student";
      assignTd.appendChild(assignButton);
      rtr.appendChild(assignTd);

      table.appendChild(rtr);
    });
  }

  function createTableHeaders() {
    var htr = document.createElement("tr");
    REQUIRED_HEADERS.forEach(function (h) {
      var th = document.createElement("th");
      th.textContent = h;
      htr.appendChild(th);
    });

    // Add header for "Assign Student"
    var assignTh = document.createElement("th");
    assignTh.textContent = "Assign Student";
    htr.appendChild(assignTh);

    table.appendChild(htr);
  }

  function validateHeaders(headers) {
    // Check if headers match the required ones in a case-insensitive way
    var lowerCaseRequiredHeaders = REQUIRED_HEADERS.map((h) => h.toLowerCase());
    return JSON.stringify(headers) === JSON.stringify(lowerCaseRequiredHeaders);
  }
})();
