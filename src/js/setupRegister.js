import { registerPost } from "@/auth/registerApi";

export async function setupRegister() {
    const form = document.getElementById("form");

    form.addEventListener("submit", async(e) => {
        e.preventDefault();
        try {
        const fullname = document.getElementById("fullname").value;
        const email = document.getElementById("email").value;
        const identification = document.getElementById("identification").value;
        const phone = document.getElementById("phone").value;
        const birthdate = document.getElementById("birthdate").value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        const password = document.getElementById("password").value;
        const confirm = document.getElementById("confirm-password").value;

        if (password !== confirm) {
            return alert("No coinciden las contraseñas")

        }
        const newuser = {
            fullname: fullname,
            emailInput: email,
            identification: identification,
            phone: phone,
            birthdate: birthdate,
            sexo: gender,
            password_hash: password,
            role: 3
        }



        
            const data = await registerPost(newuser);
            if(!data.ok)
            alert("Usuario creado exitosamente");
        } catch (error) {
            alert(error.response?.data?.message || error.message || "Error en el registro");
        }
    })

}