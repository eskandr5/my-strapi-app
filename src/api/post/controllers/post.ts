/**
 * post controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
    async create(ctx) {
        try {
            let entity;

            // التحقق مما إذا كان الطلب يحتوي على ملفات (صور)
            if (ctx.is('multipart')) {
                const { data } = ctx.request.body;
                const { files } = ctx.request;

                // تحويل البيانات من نص إلى كائن (Object)
                const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

                // إنشاء المنشور وربط الصور
                entity = await strapi.service('api::post.post').create({
                    data: { ...parsedData, publishedAt: new Date() },
                    files,
                });
            } else {
                // في حالة النص فقط
                entity = await strapi.service('api::post.post').create(ctx.request.body);
            }

            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (err) {
            ctx.body = err;
            ctx.status = 500;
        }
    },

    // جلب البيانات مع الصور والعلاقات
    async find(ctx) {
        ctx.query = {
            ...ctx.query,
            populate: {
                image: true,
                user: { fields: ['username', 'email'] },
                comments: { populate: { user: { fields: ['username'] } } },
                likes: { populate: { user: { fields: ['username'] } } }
            }
        };
        return await super.find(ctx);
    },

    async findOne(ctx) {
        ctx.query = {
            ...ctx.query,
            populate: {
                image: true,
                user: { fields: ['username', 'email'] },
                comments: { populate: { user: { fields: ['username'] } } },
                likes: { populate: { user: { fields: ['username'] } } }
            }
        };
        return await super.findOne(ctx);
    }
}));