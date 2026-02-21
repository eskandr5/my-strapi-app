'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
    async find(ctx) {
        // تحديث الاستعلام ليشمل العلاقات العميقة
        ctx.query = {
            ...ctx.query,
            populate: {
                // جلب صورة المنشور
                image: {
                    populate: true
                },
                // جلب صاحب المنشور
                user: {
                    fields: ['username', 'email'] // يمكنك تحديد الحقول التي تريدها فقط للأمان
                },
                // جلب اللايكات مع بيانات المستخدم الذي قام باللايك
                likes: {
                    populate: {
                        user: {
                            fields: ['username']
                        }
                    }
                },
                // جلب التعليقات مع بيانات المستخدم الذي كتب التعليق
                comments: {
                    populate: {
                        user: {
                            fields: ['username']
                        }
                    }
                }
            },
        };

        const { data, meta } = await super.find(ctx);
        return { data, meta };
    },

    async findOne(ctx) {
        ctx.query = {
            ...ctx.query,
            populate: {
                image: {
                    populate: true
                },
                user: {
                    fields: ['username', 'email']
                },
                likes: {
                    populate: {
                        user: {
                            fields: ['username']
                        }
                    }
                },
                comments: {
                    populate: {
                        user: {
                            fields: ['username']
                        }
                    }
                }
            },
        };
        const { data, meta } = await super.findOne(ctx);
        return { data, meta };
    }
}));