exports.get = function() {
    var self = this;
    var session = this.session;
    session.set('hello', '123', -1000*60*60*24*5);
    session.set('time', '56');

    // setTimeout(function(){
    var _session = session.get();
    self.response.json({ code: 400, text: _session });
    // },3000)

}
