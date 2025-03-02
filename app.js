(function () {
  var DELIMITER = ",";
  var NEWLINE = "\n";
  var REQUIRED_HEADERS = ["Student Number", "Student Name", "Student Email"];
  var i = document.getElementById("file");
  var table = document.getElementById("table");
  var studentNumbers = new Map(); // Store student numbers and their rows

  if (!i || !table) {
    return;
  }

  // Create table headers initially
  createTableHeaders();

  i.addEventListener("change", function () {
    if (!!i.files && i.files.length > 0) {
      parseCSV(i.files[0]);
      i.value = ""; // Allow re-uploading the same file
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

    text = text.replace(/^\uFEFF/, ""); // Remove BOM (Byte Order Mark)
    var rows = text.split(NEWLINE);
    var headers = rows
      .shift()
      .trim()
      .split(DELIMITER)
      .map((h) => h.trim().toLowerCase()); // Convert to lowercase and trim for comparison

    if (!validateHeaders(headers)) {
      alert(
        "Invalid CSV headers. The file must contain: Student Number, Student Name, and Student Email.",
      );
      return;
    }

    var newEntries = new Map();

    rows.forEach(function (r) {
      r = r.trim();
      if (!r) return;

      // Correctly handle quoted CSV values (like names)
      var cols = r.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (!cols || cols.length !== REQUIRED_HEADERS.length) return;

      // Remove surrounding quotes and trim each column
      cols = cols.map((c) => c.replace(/^"|"$/g, "").trim());

      var studentNumber = cols[0];
      newEntries.set(studentNumber, cols);
    });

    newEntries.forEach((cols, studentNumber) => {
      if (studentNumbers.has(studentNumber)) {
        var replace = confirm(
          `Student Number ${studentNumber} already exists. Do you want to replace the existing data?`,
        );
        if (replace) {
          var existingRow = studentNumbers.get(studentNumber);
          existingRow.cells[1].textContent = cols[1];
          existingRow.cells[2].textContent = cols[2];
        }
      } else {
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
        studentNumbers.set(studentNumber, rtr);
      }
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
    // Trim and compare headers in a case-insensitive way
    var lowerCaseRequiredHeaders = REQUIRED_HEADERS.map((h) =>
      h.trim().toLowerCase(),
    );
    var trimmedHeaders = headers.map((h) => h.trim().toLowerCase());
    return (
      JSON.stringify(trimmedHeaders) ===
      JSON.stringify(lowerCaseRequiredHeaders)
    );
  }
})();
