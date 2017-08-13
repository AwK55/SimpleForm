const MyForm = {
    getData() {
        return {
            fio: document.getElementById("myform__input-fio").value,
            email: document.getElementById("myform__input-email").value,
            phone: document.getElementById("myform__input-phone").value
        }
    },

    setData(obj) {
        if (obj) {
            document.getElementById("myform__input-fio").value = obj.fio;
            document.getElementById("myform__input-email").value = obj.email;
            document.getElementById("myform__input-phone").value = obj.phone;
        }
    },

    validate() {
        function clearErrorClass() {
            var inputs = document.getElementsByClassName("simple-form__input simple-form__input--error");
            while(inputs.length!=0) {
                inputs.item(0).className = "simple-form__input";
            }
        }

        function validateEmail(email) {
            var re = /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/;
            var re = /^[a-zA-Z0-9_.+-]+@?(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/;
            return re.test(email);
        }

        function validateName(name) {
            //include all symbols like %#@%^!
            //var re = /^(?:(?:^| )\S+ *){3}$/;
            //var re = /^\s*([a-zA-Z0-9а-яА-ЯёЁ'-]+\s*){3}$/;
            var re = /^[a-zA-Z0-9а-яА-ЯёЁ'-]{1,} [a-zA-Z0-9а-яА-ЯёЁ'-]{1,} [a-zA-Z0-9а-яА-ЯёЁ'-]{1,}$/
            return re.test(name);
        }

        function validatePhone(phone) {
            var phoneArray = phone.substring(1).split('');
            var checkSum = (phoneArray) => {
                var sum = 0;
                phoneArray.forEach(function (element) {
                    var n = parseInt(element);
                    if (isNaN(n)) return sum;
                    else sum += n;
                }, this);
                return sum;
            }
            var re = /^\+7\([\d]{2,3}\)[\d]{2,3}-[\d]{2,3}-[\d]{2,3}$/
            return re.test(phone) && checkSum(phoneArray) <= 30;
        }

        function getValidationResult(fieldsData) {
            var result = {
                isValid: false,
                errorFields: []
            }

            if (!validateName(fieldsData.fio)) result.errorFields.push("fio");
            if (!validateEmail(fieldsData.email)) result.errorFields.push("email");
            if (!validatePhone(fieldsData.phone)) result.errorFields.push("phone");

            result.isValid = result.errorFields.length == 0 ? true : false;

            return result;
        }

        clearErrorClass();
        var result = getValidationResult(this.getData());

        return result;
    },

    submit() {

        function disableButton() {
            var btn = document.getElementById("submitButton");
            btn.disabled = true;
            //btn.className += " btn__submit--disabled";
            btn.classList.add("btn__submit--disabled");
        }

        function generateResponceUrl() {
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            }
            const responseVarinants = ["success", "progress", "error"];
            var i = getRandomInt(0, responseVarinants.length);
            return "/response/" + responseVarinants[i] + ".json"
        }

        function responseHandler(data) {
            function error(data) {

                var resultContainer = document.getElementById("resultContainer");
                resultContainer.classList.add("error");
                if (data.reason) {
                    var p = document.createElement("p");
                    p.textContent = data.reason;
                    resultContainer.appendChild(p);
                }
            }

            function success() {
                var resultContainer = document.getElementById("resultContainer");
                resultContainer.classList.add("success");
            }

            function progress(data) {
                var resultContainer = document.getElementById("resultContainer");
                resultContainer.classList.add("progress");
                if (data.timeout) setTimeout(sendRequenst, parseInt(data.timeout))
            }

            if (!data) return false;
            switch (data.status) {
                case "success":
                    success();
                    break;
                case "error":
                    error(data);
                    break;
                case "progress":
                    progress(data);
                    break;
            }
        }

        function showIncorrectFields(validateResult) {

            var patternId = "myform__input-";
            for (var i = 0; i < validateResult.errorFields.length; i++) {
                var field = document.getElementById(patternId + validateResult.errorFields[i]);
                field.className += " simple-form__input--error"
            }
        }

        function sendRequenst(data) {
            document.getElementById('myForm').action = generateResponceUrl();
            $.ajax({
                type: "get",
                datatype: "json",
                url: $("#myForm").attr("action"),
                contentType: "application/json; charset=utf-8",
                data: data,
                success: function (data) {
                    responseHandler(data);
                }
            });
        }


        var validateResult = this.validate();
        if (validateResult.isValid) {
            disableButton();
            sendRequenst(this.getData());
        } else {
            showIncorrectFields(validateResult)
        }
    }
}