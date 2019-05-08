module.exports = app => {
    const { router, controller } = app;
    
    router.get('/MP_verify_ysZJMVdQxMoU8v35.txt', controller.check.index);

    router.get('/', controller.home.index);

    router.post('/getTicket', controller.getTicket.index);
};