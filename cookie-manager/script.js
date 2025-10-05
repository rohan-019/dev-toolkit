// Cookie Manager
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#cookie-table tbody");
  const refreshBtn = document.getElementById("refresh-btn");
  const copyAllBtn = document.getElementById("copy-all-btn");
  const clearAllBtn = document.getElementById("clear-all-btn");

  const inputName = document.getElementById("c-name");
  const inputValue = document.getElementById("c-value");
  const inputExpires = document.getElementById("c-expires");
  const inputPath = document.getElementById("c-path");
  const inputDomain = document.getElementById("c-domain");
  const inputSecure = document.getElementById("c-secure");
  const inputSameSite = document.getElementById("c-samesite");

  const saveBtn = document.getElementById("save-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const copyBtn = document.getElementById("copy-btn");

  // Parse document.cookie -> [{name, value}]
  function parseCookies() {
    const raw = document.cookie || "";
    if (!raw) return [];
    return raw.split("; ").map((pair) => {
      const idx = pair.indexOf("=");
      const name = idx > -1 ? pair.slice(0, idx) : pair;
      const value = idx > -1 ? decodeURIComponent(pair.slice(idx + 1)) : "";
      return { name, value };
    });
  }

  function renderTable() {
    const cookies = parseCookies();
    tableBody.innerHTML = "";
    if (cookies.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 3;
      td.className = "muted";
      td.textContent = "No accessible cookies.";
      tr.appendChild(td);
      tableBody.appendChild(tr);
      return;
    }

    cookies.forEach((c) => {
      const tr = document.createElement("tr");
      const nameTd = document.createElement("td");
      nameTd.textContent = c.name;
      const valTd = document.createElement("td");
      valTd.textContent =
        c.value.length > 80 ? c.value.slice(0, 80) + "…" : c.value;

      const actionTd = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "ghost";
      editBtn.style.padding = "4px 8px";
      editBtn.addEventListener("click", () => populateForm(c));

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "ghost";
      delBtn.style.padding = "4px 8px";
      delBtn.addEventListener("click", () => deleteCookie(c.name));

      const copyBtnRow = document.createElement("button");
      copyBtnRow.innerHTML = '<i class="fas fa-copy"></i>';
      copyBtnRow.className = "ghost";
      copyBtnRow.style.padding = "4px 8px";
      copyBtnRow.title = "Copy name=value";
      copyBtnRow.addEventListener("click", () => {
        navigator.clipboard.writeText(
          `${c.name}=${encodeURIComponent(c.value)}`
        );
        copyBtnRow.textContent = "Copied";
        setTimeout(
          () => (copyBtnRow.innerHTML = '<i class="fas fa-copy"></i>'),
          900
        );
      });

      actionTd.appendChild(editBtn);
      actionTd.appendChild(delBtn);
      actionTd.appendChild(copyBtnRow);

      tr.appendChild(nameTd);
      tr.appendChild(valTd);
      tr.appendChild(actionTd);
      tableBody.appendChild(tr);
    });
  }

  function populateForm(cookie) {
    inputName.value = cookie.name;
    inputValue.value = cookie.value;
    // defaults
    inputExpires.value = "";
    inputPath.value = "/";
    inputDomain.value = "";
    inputSecure.checked = false;
    inputSameSite.checked = true;
  }

  // Build cookie string and set
  function setCookie({ name, value, days, path, domain, secure, sameSite }) {
    if (!name) {
      alert("Cookie name is required.");
      return;
    }
    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(
      value || ""
    )}`;
    if (days !== undefined && days !== null && days !== "") {
      const d = new Date();
      d.setTime(d.getTime() + Number(days) * 24 * 60 * 60 * 1000);
      cookieStr += `; expires=${d.toUTCString()}`;
    }
    cookieStr += `; path=${path || "/"}`;
    if (domain) cookieStr += `; domain=${domain}`;
    if (secure) cookieStr += `; secure`;
    // SameSite option
    cookieStr += `; samesite=${sameSite ? "Lax" : "Strict"}`;
    // set cookie
    document.cookie = cookieStr;
    // refresh
    renderTable();
  }

  // Delete cookie by setting expiry in past. Must match path/domain to fully remove.
  function deleteCookie(name) {
    if (!confirm(`Delete cookie "${name}" for current path/domain?`)) return;
    // try multiple common paths for better deletion chance
    const paths = [document.location.pathname || "/", "/"];
    const domains = [document.location.hostname];
    // also try root variants
    const hostParts = document.location.hostname.split(".");
    if (hostParts.length > 2) {
      domains.push(hostParts.slice(-2).join("."));
    }
    domains.push("");

    paths.forEach((p) => {
      domains.forEach((d) => {
        document.cookie = `${encodeURIComponent(
          name
        )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}${
          d ? `; domain=${d}` : ""
        }`;
      });
    });
    setTimeout(renderTable, 200);
  }

  function copyAllCookieString() {
    navigator.clipboard.writeText(document.cookie || "");
    copyAllBtn.textContent = "Copied";
    setTimeout(
      () =>
        (copyAllBtn.innerHTML =
          '<i class="fas fa-copy"></i> Copy all cookie string'),
      1000
    );
  }

  function clearAllCookies() {
    if (
      !confirm("Delete all accessible (non-HttpOnly) cookies for this domain?")
    )
      return;
    const cookies = parseCookies();
    cookies.forEach((c) => {
      deleteCookie(c.name);
    });
    setTimeout(renderTable, 300);
  }

  // save button action: create/update cookie from form
  saveBtn.addEventListener("click", () => {
    const name = inputName.value.trim();
    const value = inputValue.value;
    const days = inputExpires.value === "" ? "" : Number(inputExpires.value);
    const path = inputPath.value.trim() || "/";
    const domain = inputDomain.value.trim();
    const secure = inputSecure.checked;
    const sameSite = inputSameSite.checked;

    if (!name) {
      alert("Please provide cookie name.");
      return;
    }
    setCookie({ name, value, days, path, domain, secure, sameSite });
    // quick UI feedback
    saveBtn.textContent = "Saved ✓";
    setTimeout(() => (saveBtn.textContent = "Save Cookie"), 900);
  });

  deleteBtn.addEventListener("click", () => {
    const name = inputName.value.trim();
    if (!name) {
      alert("Enter cookie name to delete (or click one in the list).");
      return;
    }
    deleteCookie(name);
  });

  copyBtn.addEventListener("click", () => {
    const name = inputName.value.trim();
    const value = inputValue.value;
    if (!name) {
      alert("Select or enter cookie name to copy.");
      return;
    }
    navigator.clipboard.writeText(`${name}=${encodeURIComponent(value)}`);
    copyBtn.textContent = "Copied";
    setTimeout(() => (copyBtn.textContent = "Copy cookie string"), 900);
  });

  refreshBtn.addEventListener("click", renderTable);
  copyAllBtn.addEventListener("click", copyAllCookieString);
  clearAllBtn.addEventListener("click", clearAllCookies);

  // initial render
  renderTable();
});
