import {cpf_mask, testCPF}  from './utils.js';

//Validação de data de nascimento
function validateDate(field) {
  var data = new Date();
  var ano = data.getFullYear();
  const dateArray = field.value.split("-");
  const inputYear = dateArray[0];
  if (!field.value.trim()) {
    return "Insira uma data";
  }
  if (Number(inputYear) >= ano) {
    return "Insira uma data válida";
  }
  return true;
}
//Validando se o nome foi inserido
function validateName(field) {
  const valueInput = field.value;
  if (!valueInput.trim()) {
    return "Por favor, insira seu nome";
  } else {
    return true;
  }
}
//Validação do CPF
function validateCpf(field) {
  const formatedCpf = field.value.replace(/\D/g, "");
  if (!field.value.trim()) {
    return "Insira o CPF";
  }
  console.log(testCPF(formatedCpf));
  if (!testCPF(formatedCpf)) {
    return "Insira um cpf válido";
  }
  return true;
}

const form = document.querySelector("#form");
const inputName = document.querySelector("#nome");
const inputDate = document.querySelector("#dataNas");
const inputCpf = document.querySelector("#cpf");
const msgReturn = document.querySelector(".msg-return");

inputCpf.addEventListener('keypress', (e) => cpf_mask(e, inputCpf, '###.###.###-##'));

//Tratamento de erros
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let nameErrorMessage = validateName(inputName);
  let dateErrorMessage = validateDate(inputDate);
  let cpfErrorMessage = validateCpf(inputCpf);

  if (nameErrorMessage !== true) {
    inputName.nextElementSibling.innerHTML = nameErrorMessage;
    inputName.classList.add('invalid')
    inputName.classList.remove('valid')
  } else {
    inputName.nextElementSibling.innerHTML = "";
    inputName.classList.add('valid')
    inputName.classList.remove('invalid')
  }
  if (dateErrorMessage !== true) {
    inputDate.nextElementSibling.innerHTML = dateErrorMessage;
    inputDate.classList.add('invalid')
    inputDate.classList.remove('valid')
  } else {
    inputDate.nextElementSibling.innerHTML = "";
    inputDate.classList.add('valid')
    inputDate.classList.remove('invalid')
  }
  if (cpfErrorMessage !== true) {
    inputCpf.nextElementSibling.innerHTML = cpfErrorMessage;
    inputCpf.classList.add('invalid')
    inputCpf.classList.remove('valid')
  } else {
    inputCpf.nextElementSibling.innerHTML = "";
    inputCpf.classList.add('valid')
    inputCpf.classList.remove('invalid')
  }
  if (
    nameErrorMessage === true &&
    dateErrorMessage === true &&
    cpfErrorMessage === true
  ) {
    msgReturn.innerHTML = "Formulário enviado com sucesso!";
  } else {
    msgReturn.innerHTML = " ";
  }
});
