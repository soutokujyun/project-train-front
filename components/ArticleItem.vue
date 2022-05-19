<template>
    <div class="article-item">
        <h2>
            <nuxt-link :to="'/article/'+article._id">
                {{ article.title }}
            </nuxt-link>
        </h2>
        <div>
            <div>{{ article.author }}</div>
            <span>{{ article.views }}</span>
            <span>{{ article.like }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['article']
    }
</script>

<style>
.article-item {
    padding: 20px 15px;
    border-bottom: 2px solid #eee;
}
.article-item h2 {
    height: 100px;
}
.article-item a {
    color: #67c23a;
}
</style>