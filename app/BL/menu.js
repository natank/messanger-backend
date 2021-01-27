export function getMenu(req, res, next) {
	res.status(200).json({ errorMessage: req.flash('error') });
}
