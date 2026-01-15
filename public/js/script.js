(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// ===============================
// DISPLAY TAX SWITCH (SAFE)
// ===============================
const taxSwitch = document.getElementById("switchCheckDefault");

if (taxSwitch) {
  taxSwitch.addEventListener("click", () => {
    const taxInfo = document.getElementsByClassName("tax-info");
    for (let info of taxInfo) {
      info.style.display = info.style.display === "inline" ? "none" : "inline";
    }
  });
}