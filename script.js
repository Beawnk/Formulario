const validationState = new Set();
const loginForm = document.querySelector("#form");
let data = [];
let insertedName;
let insertedDate;
let insertedCpf;

function manipulateValidationMsg(validationData) {
  const { inputProps, action } = validationData;
  const elementValidationMsg = inputProps.nextElementSibling;
  const validationMsgClasses = elementValidationMsg.classList;
  const removeClass = () => {
    validationMsgClasses.remove("hide");
    inputProps.classList.add("invalid");
  };
  const addClass = () => {
    inputProps.classList.remove("invalid");
    inputProps.classList.add("valid");
    validationMsgClasses.add("hide");
  };

  return action === "hide" ? addClass() : removeClass();
}
// Validação de cada campo (nome, data e cpf)
function validationRules() {
  return {
    username: (inputProps) => {
      const usernameValidationRule = /[A-Za-z0-9]{3,}/;
      const inputValue = inputProps.value;
      const inputName = inputProps.name;
      const isInputValid = usernameValidationRule.test(inputValue);

      isInputValid
        ? manageState().removeFromState({ inputProps, inputName })
        : manageState().addToState({ inputProps, inputName });

      return true;
    },
    date: (inputProps) => {
      const inputValue = inputProps.value;
      const inputName = inputProps.name;
      let isInputValid = !validateDate();
      function validateDate() {
        var data = new Date();
        var ano = data.getFullYear();
        var anoMin = ano - 180;
        const dateArray = inputValue.split("-");
        const inputYear = dateArray[0];
        return Number(inputYear) >= ano || Number(inputYear) <= anoMin;
      }
      isInputValid
        ? manageState().removeFromState({ inputProps, inputName })
        : manageState().addToState({ inputProps, inputName });
      return true;
    },
    cpf: (inputProps) => {
      // Validação dos valores do cpf
      const inputValue = inputProps.value;
      const inputName = inputProps.name;
      let isInputValid = testCPF(inputValue);
      isInputValid
        ? manageState().removeFromState({ inputProps, inputName })
        : manageState().addToState({ inputProps, inputName });
      function testCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf == "") return false;
        if (
          cpf.length != 11 ||
          cpf == "00000000000" ||
          cpf == "11111111111" ||
          cpf == "22222222222" ||
          cpf == "33333333333" ||
          cpf == "44444444444" ||
          cpf == "55555555555" ||
          cpf == "66666666666" ||
          cpf == "77777777777" ||
          cpf == "88888888888" ||
          cpf == "99999999999"
        )
          return false;

        let add = 0;
        for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
        let rev = 11 - (add % 11);
        if (rev == 10 || rev == 11) rev = 0;
        if (rev != parseInt(cpf.charAt(9))) return false;
        add = 0;
        for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11) rev = 0;
        if (rev != parseInt(cpf.charAt(10))) return false;
        return true;
      }
      return true;
    },
    emptyFields: () => {
      const formInputElems = [...loginForm.elements].filter(
        (item) => item.nodeName === "INPUT"
      );
      for (const inputProps of formInputElems) {
        const inputName = inputProps.name;
        const inputValue = inputProps.value;

        if (!inputValue) {
          manageState().addToState({ inputProps, inputName });
        }
      }
    },
  };
}
// Chama as funções de validação em uma só
function validateForm(inputProps) {
  const inputName = inputProps.name;
  const verifyInputName = {
    username: validationRules().username,
    date: validationRules().date,
    cpf: validationRules().cpf,
  };
  return verifyInputName[inputName](inputProps);
}
function manageState() {
  return {
    addToState: (inputData) => {
      const { inputProps, inputName } = inputData;

      validationState.add(inputName);
      manipulateValidationMsg({ inputProps });
    },
    removeFromState: (inputData) => {
      const action = "hide";
      const { inputProps, inputName } = inputData;
      validationState.delete(inputName);
      manipulateValidationMsg({ inputProps, action });
    },
    validateState: () => {
      if (validationState.size > 0) {
        return false;
      }
      if (validationState.size === 0) {
        validationRules().emptyFields();
        return true;
      }
    },
  };
}
// Evento para chamar mensagens de erro sem enviar formulário
function attachKeyUpEvent() {
  loginForm.addEventListener("keyup", function (event) {
    const nodeName = event.target.nodeName;
    const inputProps = event.target;

    if (nodeName === "INPUT") {
      validateForm(inputProps);
    }
  });
}
// Submit
function submitForm() {
  const submitButton = document.getElementsByClassName("js-submit-user")[0];

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    manageState().validateState();
    if (manageState().validateState()) {
      insertedName = document.querySelector('[name="username"]').value;
      insertedDate = document.querySelector('[name="date"]').value;
      insertedCpf = document.querySelector('[name="cpf"]').value;
      document.querySelectorAll("#form input").forEach((e, i) => {
        e.value = "";
      });
      formatedData = insertedDate.split("-").reverse().join("/");
      alert(`
                Formulário enviado com sucesso!\n  
                Dados Submetidos:
                ${insertedName}
                ${formatedData}
                ${insertedCpf}`);
                window.location.reload()
    }
  });
}
// Formatação do cpf ___.___.___-__
function cpf_mask(key, inputCpf, cpfSize) {
  var code = key.which ? key.which : key.keyCode;
  if (code == 8) return true;
  if (code != 46 && (code < 48 || code > 57)) return false;
  inputCpf.maxLength = cpfSize.length;
  var entrada = inputCpf.value;
  if (
    cpfSize.length > entrada.length &&
    cpfSize.charAt(entrada.length) != "#"
  ) {
    inputCpf.value = entrada + cpfSize.charAt(entrada.length);
  }
  return true;
}
// Init
function init() {
  attachKeyUpEvent();
  submitForm();
}
document.querySelector("input#cpf").addEventListener("keypress", (e) => {
  cpf_mask(e, document.querySelector("input#cpf"), "###.###.###-##");
});
document.addEventListener("DOMContentLoaded", init);