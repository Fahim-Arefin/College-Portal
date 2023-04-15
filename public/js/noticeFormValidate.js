function validateName() {
    var name = document.forms["myForm"]["notice[noticeHolder]"].value;
    var nameInput = document.getElementById("nameInput");
    var nameError = document.getElementById("nameError");

    if (name == "") {
        nameInput.classList.add("border-red-500");
        nameInput.classList.remove("border-green-500");
        nameError.classList.remove("hidden");
        nameError.innerHTML = "Name is required";
        return false;
    } else {
        nameInput.classList.remove("border-red-500");
        nameInput.classList.add("border-green-500");
        nameError.classList.add("hidden");
        return true;
    }
}

function validateEmail() {
    var email = document.forms["myForm"]["notice[email]"].value;
    var emailInput = document.getElementById("emailInput");
    var emailError = document.getElementById("emailError");

    if (email == "") {
        emailInput.classList.add("border-red-500");
        emailInput.classList.remove("border-green-500");
        emailError.classList.remove("hidden");
        emailError.innerHTML = "Email is required";
        return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.classList.add("border-red-500");
        emailInput.classList.remove("border-green-500");
        emailError.classList.remove("hidden");
        emailError.innerHTML = "Please enter a valid email address";
        return false;
    } else {
        emailInput.classList.remove("border-red-500");
        emailInput.classList.add("border-green-500");
        emailError.classList.add("hidden");
        return true;
    }
}

function validateMessage() {
    var message = document.forms["myForm"]["notice[noticeText]"].value;
    var messageInput = document.getElementById("messageInput");
    var messageError = document.getElementById("messageError");

    if (message == "") {
        messageInput.classList.add("border-red-500");
        messageInput.classList.remove("border-green-500");
        messageError.classList.remove("hidden");
        messageError.innerHTML = "Message is required";
        return false;
    } else {
        messageInput.classList.remove("border-red-500");
        messageInput.classList.add("border-green-500");
        messageError.classList.add("hidden");
        return true;
    }
}

function validateForm() {
    var nameIsValid = validateName();
    var emailIsValid = validateEmail();
    var messageIsValid = validateMessage();

    if (nameIsValid && emailIsValid && messageIsValid) {
        document.getElementById("formMessage").classList.remove("hidden");
        document.getElementById("formMessage").classList.add("bg-green-100", "border", "text-green-700", "px-4", "py-3", "rounded", "relative", "mb-4");
        document.getElementById("formMessage").innerHTML = "Form submitted successfully";
        return true;
    } else {
        document.getElementById("formMessage").classList.add("hidden");
        return false;
    }
}