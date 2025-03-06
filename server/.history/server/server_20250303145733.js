const express = require('express');
const { sequelize, ActiveList } = require('./models');

const app = express();
const PORT = 5000;


app.use(express.json());

//Sync database
sequelize.sync({alter: true}).then(() => console.log('✅ Database Synced!'));

//API to Update ActiveList and Sync Vacancies
app.put('/update-active/:id', async(req, res) => {
    const{id} = req.params;
    const{status} = req.body;

    const activePosition = await ActiveList.findByPk(id);
    if(!activePosition) return res.status(404).json({meessage: 'Position not found' })

        activePosition.status = status;
        await activePosition.save();

        res.json({ message: 'Position updated and vacancy reflected!'})
});

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));
