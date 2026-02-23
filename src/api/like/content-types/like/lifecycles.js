module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // جلب بيانات المنشور كاملة لمعرفة صاحب المنشور (الـ receiver)
    // لأن 'result' المبدئية قد تحتوي فقط على معرفات (IDs)
    const postWithAuthor = await strapi.entityService.findOne('api::post.post', result.post.id, {
      populate: ['user'],
    });

    try {
      await strapi.entityService.create('api::notification.notification', {
        data: {
          text: 'liked your post',
          type: 'like',
          isRead: false,
          sender: result.user.id, // الشخص الذي قام باللايك
          receiver: postWithAuthor.user.id, // صاحب المنشور الذي سيستلم الإشعار
          publishedAt: new Date(), // لضمان النشر الفوري وعدم بقائه Draft
        },
      });
      console.log("Notification created successfully!");
    } catch (err) {
      console.error("Error creating notification:", err);
    }
  },
};