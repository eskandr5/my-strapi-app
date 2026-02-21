'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
    async create(ctx) {
        try {
            let entity;

            if (ctx.is('multipart')) {
                // استلام البيانات والملفات
                const { data } = ctx.request.body;
                const { files } = ctx.request;

                // تحويل النص إلى JSON إذا لزم الأمر
                const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

                // إنشاء المنشور وربط الملفات (files)
                entity = await strapi.service('api::post.post').create({
                    data: { ...parsedData, publishedAt: new Date() },
                    files: files
                });
            } else {
                // حالة النص فقط (الكود الذي كان يعمل لديك)
                entity = await strapi.service('api::post.post').create(ctx.request.body);
            }

            const sanitizedEntity = await super.sanitizeOutput(entity, ctx);
            return super.transformResponse(sanitizedEntity);
        } catch (err) {
            ctx.status = 500;
            ctx.body = { error: err.message };
        }
    },

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