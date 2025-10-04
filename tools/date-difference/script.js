function calculateDifference() {
      const startInput = document.getElementById("start-date").value;
      const endInput = document.getElementById("end-date").value;
      const resultDisplay = document.getElementById("result-display");
      const copyBtn = document.getElementById("copy-btn");

      if (!startInput || !endInput) {
        resultDisplay.textContent = "⚠️ Please select both start and end dates.";
        copyBtn.disabled = true;
        return;
      }

      const startDate = new Date(startInput);
      const endDate = new Date(endInput);

      if (endDate < startDate) {
        resultDisplay.textContent = "⚠️ End date must be after start date.";
        copyBtn.disabled = true;
        return;
      }

      let years = endDate.getFullYear() - startDate.getFullYear();
      let months = endDate.getMonth() - startDate.getMonth();
      let days = endDate.getDate() - startDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

      const resultText = 
        `🗓️ Difference:\n` +
        `➡️ ${years} year(s), ${months} month(s), ${days} day(s)\n\n` +
        `📌 Total Days: ${totalDays}`;

      resultDisplay.textContent = resultText;
      copyBtn.disabled = false;
    }

    document.getElementById("calculate-btn").addEventListener("click", calculateDifference);

  
    document.getElementById("copy-btn").addEventListener("click", function() {
      const resultText = document.getElementById("result-display").textContent;
      navigator.clipboard.writeText(resultText).then(() => {
        this.textContent = "✔ Copied!";
        this.classList.add("copied");
        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-copy"></i> Copy Result';
          this.classList.remove("copied");
        }, 2000);
      });
    });

    document.querySelectorAll("input[type='date']").forEach(input => {
      input.addEventListener("click", () => {
        if (input.showPicker) {
          input.showPicker();
        }
      });
    });