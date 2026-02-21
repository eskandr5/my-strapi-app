'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { parseMultipartData } = require('@strapi/utils');

module.exports = createCoreController('api::post.post', ({ strapi }) => ({

    async create(ctx) {
        let entity;

        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.service('api::post.post').create({
                data: { ...data, publishedAt: new Date() },
                files
            });
        } else {
            entity = await strapi.service('api::post.post').create(ctx.request.body);
        }

        // استخدام super بدلاً من this لإيقاف التنبيهات الحمراء
        const sanitizedEntity = await super.sanitizeOutput(entity, ctx);
        return super.transformResponse(sanitizedEntity);
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