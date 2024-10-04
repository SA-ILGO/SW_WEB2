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


module.exports = router; 