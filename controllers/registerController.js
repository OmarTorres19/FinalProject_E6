exports.userRegister = (req, res) => {

    const { name, tel, email } = req.body;

    //Validaciones básicas
    if(!name || !tel || !email) {
        return res.status(400).json({
            message: "All fields must be filled"
        });
    }

    //Simulación de guardado
    const user = {
        name,
        tel,
        email
    };

    console.log("Data received:", user);

    res.status(200).json({
        message: "User registered successfully",
        data: user
    });
};