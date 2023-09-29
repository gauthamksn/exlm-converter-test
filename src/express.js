let main = renderDoc(id)



main.then((main) => {
    const app = express();

    let id = "recXZZxBo4pkOnx9k";

    app.get("/", (req, res) => {
        res.send("EXLM CONVERTER")
    })

    app.get("/test-notes", (req, res) => {
        res.send(main);
    });

    app.get(id, (res, req) => {
        console.log(id)
    })

    app.listen(5000, () => {
        console.log("Listening on the port 5000 : http://localhost:5000/test-notes");
    });
})