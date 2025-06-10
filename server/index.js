const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const dbConnect = require('./utils/dbConnect')

const colorRoutes = require('./routes/colorRoutes');
const coatingRoutes = require('./routes/coatingRoutes');
const extrasRoutes = require('./routes/extrasRoutes');


// new
const ageGroupRoutes = require('./routes/ageGroupRoutes');

const uploadRoutes = require('./routes/upload')
const recommendedLensRoutes = require('./routes/recommendedLensRoutes');
const lensRoutes = require('./routes/lensRoutes')
const designRoutes = require('./routes/designRoutes')





const app = express()

app.use(
    cors({
        origin: '*',
        methods: ['POST', 'GET', 'PUT', 'DELETE'],
        credentials: true,
    })
)
app.use(bodyParser.json())

dbConnect()

app.use('/api/colors', colorRoutes);
app.use('/api/coatings', coatingRoutes);
app.use('/api/extras', extrasRoutes);

// app.use('/api/lens-designs', lensDesignRoutes);
// app.use('/api/lens',lensRoutes)

// new
app.use('/api/upload', uploadRoutes)

app.use('/api/age-groups',ageGroupRoutes)

app.use('/api/recommended-lenses', recommendedLensRoutes);

app.use('/api/lenses',lensRoutes)

app.use('/api/designs',designRoutes)





// app.use('*', (req, res) => {
//   res.json('not found')
// })

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
