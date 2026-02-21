'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
    async find(ctx) {
        // تعديل الطلب ليشمل التعليقات والمستخدمين دائماً
        ctx.query = {
            ...ctx.query,
            populate: {
                image: true,
                user: true,
                likes: {
                    populate: { user: true }
                },
                comments: {
                    populate: { user: true }
                }
            },
        };

        // تشغيل الدالة الأصلية مع الإعدادات الجديدة
        const { data, meta } = await super.find(ctx);
        return { data, meta };
    },

    async findOne(ctx) {
        ctx.query = {
            ...ctx.query,
            populate: {
                image: true,
                user: true,
                likes: {
                    populate: { user: true }
                },
                comments: {
                    populate: { user: true }
                }
            },
        };
        const { data, meta } = await super.findOne(ctx);
        return { data, meta };
    }
}));