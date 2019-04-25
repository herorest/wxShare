module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);

    router.get('/ticket', controller.getTicket.index);
};