const express = require('express');
const userDBC = require('./usersDBC');
const router = express.Router();

router.post('/receiptReady/:NUID', async (req, res) => {
    const res_signup = {
        status_code: 500
    };

    try {
        const NUID = req.params.NUID;  
        const rows = await userDBC.ReceiptReady(NUID);
 
        if (rows.affectedRows > 0) {
            res_signup.status_code = 200;  
        } else {
            res_signup.status_code = 201;  
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        res.json(res_signup);
    }
});

router.post('/received/:NUID', async (req, res) => {
    const res_signup = {
        status_code: 500
    };

    try {
        const NUID = req.params.NUID;  
        const rows = await userDBC.Received(NUID);
 
        if (rows.affectedRows > 0) {
            res_signup.status_code = 200;  
        } else {
            res_signup.status_code = 201;  
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        res.json(res_signup);
    }
});

router.post('/notReceived/:NUID', async (req, res) => {
    const res_signup = {
        status_code: 500
    };

    try {
        const NUID = req.params.NUID;  
        const rows = await userDBC.NotReceived(NUID);
 
        if (rows.affectedRows > 0) {
            res_signup.status_code = 200;  
        } else {
            res_signup.status_code = 201;  
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        res.json(res_signup);
    }
});

router.post('/minusQuantity', async (req, res) => {
    const res_signup = {
        status_code: 500
    };

    try {
        const rows = await userDBC.MinusQuantity();
 
        if (rows.affectedRows > 0) {
            res_signup.status_code = 200;  
        } else {
            res_signup.status_code = 201;  
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        res.json(res_signup);
    }
});

router.post('/plusQuantity', async (req, res) => {
    const res_signup = {
        status_code: 500
    };

    try {
        const rows = await userDBC.PlusQuantity();
 
        if (rows.affectedRows > 0) {
            res_signup.status_code = 200;  
        } else {
            res_signup.status_code = 201;  
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        res.json(res_signup);
    }
});

router.post('/setQuantity/:num', async (req, res) => {
    const res_signup = {
        status_code: 500
    };

    try {
        const num = req.params.num;
        const rows = await userDBC.SetQuantity(num);
 
        if (rows.affectedRows > 0) {
            res_signup.status_code = 200;  
        } else {
            res_signup.status_code = 201;  
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        res.json(res_signup);
    }
});

router.post('/setTotalQuantity/:num', async (req, res) => {
    const res_signup = {
        status_code: 500
    };

    try {
        const num = req.params.num;
        const rows = await userDBC.SetTotalQuantity(num);
 
        if (rows.affectedRows > 0) {
            res_signup.status_code = 200;  
        } else {
            res_signup.status_code = 201;  
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        res.json(res_signup);
    }
});

router.post('/setServerNum/:num', async (req, res) => {
    const res_signup = {
        status_code: 500
    };

    try {
        const num = req.params.num;
        const rows = await userDBC.SetServerNum(num);

        if (rows.affectedRows > 0) {
            res_signup.status_code = 200;
        } else {
            res_signup.status_code = 201;
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        res.json(res_signup);
    }
});

router.post('/updateSpot', async (req, res) => {
    const res_signup = {
        status_code: 500
    };

    try {
        const rows = await userDBC.UpdateSpot();
 
        if (rows.affectedRows > 0) {
            res_signup.status_code = 200;  
        } else {
            res_signup.status_code = 201;  
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        res.json(res_signup);
    }
});

router.post('/finishedWaitingTime/:time/:NUID', async (req, res) => {
    const res_signup = {
        status_code: 500
    };

    try {
        const time = req.params.time;
        const NUID = req.params.NUID;
        const rows = await userDBC.FinishedWaitingTime(time, NUID);
 
        if (rows.affectedRows > 0) {
            res_signup.status_code = 200;  
        } else {
            res_signup.status_code = 201;  
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        res.json(res_signup);
    }
});

// router.post('/updateServerNum', async (req, res) => {
//     try {
//         const serverNum = parseInt(req.body.serverNum, 10);
//         if (isNaN(serverNum)) {
//             throw new Error('Invalid serverNum');
//         }
//         const result = await userDBC.updateServerNum(serverNum);
//         res.json({ status: 'success', message: 'ServerNum updated successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ status: 'error', message: err.message });
//     }
// });


module.exports = router; 