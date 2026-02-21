'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
    // دالة الإنشاء لدعم الصور والنصوص معاً
    async create(ctx) {
        let entity;
        if (ctx.is('multipart')) {
            // هذه الجزئية هامة جداً لمعالجة الصور
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.service('api::post.post').create({ data, files });
        } else {
            entity = await strapi.service('api::post.post').create(ctx.request.body);
        }
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
    },

    // احتفظ بدوال find و findOne التي كتبناها سابقاً للـ Populate
    async find(ctx) {
        ctx.query = { ...ctx.query, populate: { image: true, user: true, comments: { populate: { user: true } }, likes: { populate: { user: true } } } };
        return await super.find(ctx);
    },

    async findOne(ctx) {
        ctx.query = { ...ctx.query, populate: { image: true, user: true, comments: { populate: { user: true } }, likes: { populate: { user: true } } } };
        return await super.findOne(ctx);
    }
}));