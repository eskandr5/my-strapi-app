'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({

    // دالة الإنشاء المحدثة والمبسطة
    async create(ctx) {
        try {
            let entity;

            if (ctx.is('multipart')) {
                // في Strapi v4/v5، البيانات والملفات تكون موجودة بالفعل في ctx.request
                const { data } = ctx.request.body;
                const { files } = ctx.request;

                // تحويل الـ data من نص إلى كائن إذا كانت مرسلة كـ String
                const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

                entity = await strapi.service('api::post.post').create({
                    data: { ...parsedData, publishedAt: new Date() },
                    files
                });
            } else {
                // للنصوص فقط
                entity = await strapi.service('api::post.post').create(ctx.request.body);
            }

            const sanitizedEntity = await super.sanitizeOutput(entity, ctx);
            return super.transformResponse(sanitizedEntity);
        } catch (err) {
            ctx.body = err;
            ctx.status = 500;
        }
    },

    // دالة find و findOne كما هي للـ Populate
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