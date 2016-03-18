exports.get = function() {
	console.log(this.session);
    this.json({ code: 400, text: 'eerr' });
}
