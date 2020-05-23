/*
    GET / - shows all weapons linked to user
    POST /register - Register Weapon
    DELETE /:weaponId - delete weapon
*/


const router = require("express").Router();
const auth = require("../../auth/tokenAuth");
const { processQuery } = require("../../utils/db");


/*
    @Route /
    @Auth Protected
*/
router.get("/", auth, (req, res) =>{
    processQuery("SELECT * FROM `registered_weapons` WHERE `linked_to` = ?", [req.user.username])
        .then(weapons => {
            return res.json({weapons});
        })
        .catch(err => console.log(err));
})

/*
    @Route /register
    @Auth Protected
*/
router.post("/register", auth, async (req, res) => {
    const serialNumber = () => {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < charactersLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const { owner, weapon, status, } = req.body;

    if (owner, weapon, status) {
        processQuery("INSERT INTO `registered_weapons` (`owner`, `weapon`, `serial_number`, `status`, `linked_to`) VALUES (?, ?, ?, ?, ?)", [owner, weapon, serialNumber(10), status, req.user.username])
            .then(() => {
                return res.json({ msg: "Registered" })
            })
            .catch(err => console.log(err));
    } else {
        return res.json({ msg: "Please fill in all fields" })
    }

});


/*
    @Route /:weaponId
    @Auth Protected
*/
router.delete("/:weaponId", auth, async (req, res) => {
    processQuery("DELETE FROM `registered_weapons` WHERE `id` = ?", [req.params.weaponId])
        .then(() => {
            return res.json({ msg: "Deleted Weapon" });
        })
        .catch(err => console.log(err));
});


module.exports = router;