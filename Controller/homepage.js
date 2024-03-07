
function home(req, res) {
    try {
        return res.status(200).send(`Home Page`);
    } catch (error) {
        return res.status(400).send("some went wrong");
    }
}

module.exports = {
    home,
};