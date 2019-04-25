module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);

    router.get('/getTicket', controller.getTicket.index);
};