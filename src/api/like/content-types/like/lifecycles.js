module.exports = {
  async afterCreate(event) {
    const { result } = event;

    try {
      // 1. جلب المنشور المرتبط باللايك مع جلب بيانات صاحبه (author)
      const postWithAuthor = await strapi.entityService.findOne('api::post.post', result.post.id, {
        populate: ['author'], // تأكد أن اسم الحقل في موديل الـ Post هو author
      });

      // 2. إذا كان الشخص الذي عمل لايك هو نفسه صاحب المنشور، لا نرسل إشعاراً
      if (result.user.id === postWithAuthor.author.id) return;

      // 3. إنشاء الإشعار
      await strapi.entityService.create('api::notification.notification', {
        data: {
          text: 'liked your post',
          type: 'like',
          isRead: false,
          sender: result.user.id,        // الشخص الذي ضغط لايك
          receiver: postWithAuthor.author.id, // صاحب المنشور المستلم
          publishedAt: new Date(),        // لضمان النشر الفوري
        },
      });

    } catch (err) {
      console.error("خطأ في تحويل اللايك إلى إشعار:", err);
    }
  },
};