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
const frameSummaryRoutes = require('./routes/frameSummaryRoutes')
const promosRoutes = require('./routes/promoRoutes')
const orderRoutes = require('./routes/orderRoutes')
const userRoutes = require('./routes/user');
const sightTestRoutes = require('./routes/sightTestRoutes');
const reportConfigRoutes = require('./routes/reportConfigRoutes')




const app = express()

app.use(
	cors({
		origin: '*',
		methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		credentials: true,
	})
)
app.use(bodyParser.json())

// dbConnect()

app.use(async (req, res, next) => {
	try {
		await dbConnect()
		next()
	} catch (err) {
		res.status(500).json({ error: 'Database connection failed' })
	}
})

app.use("/api/user", userRoutes);

app.use('/api/colors', colorRoutes);
app.use('/api/coatings', coatingRoutes);
app.use('/api/extras', extrasRoutes);

// app.use('/api/lens-designs', lensDesignRoutes);
// app.use('/api/lens',lensRoutes)

// new
app.use('/api/upload', uploadRoutes)

app.use('/api/age-groups', ageGroupRoutes)

app.use('/api/recommended-lenses', recommendedLensRoutes);

app.use('/api/lenses', lensRoutes)

app.use('/api/designs', designRoutes)

app.use('/api/frame-summary', frameSummaryRoutes)
app.use('/api/promos', promosRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/sight-tests', sightTestRoutes);
app.use('/api/report-config', reportConfigRoutes);






app.get("/", (req, res) => {
	res.json({ message: "Welcome to Prism App Admin API" });
});

app.use((req, res) => {
	res.status(404).json({ error: 'not found' })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Server started on port ${port}`)
})
