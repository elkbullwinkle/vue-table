<template>
    <div class="overlay" v-if="display">
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props : {
            display : {
                default : true,
                type : Boolean,
            }
        }
    }
</script>

<style>
    .overlay {
        position :fixed;

        z-index: 5000;

        width: 100%;
        height : 100%;
        background-color: rgba(0,0,0,.7);

        margin: auto;

        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

    }

    .spinner {
        margin: 100px auto 0;
        width: 70px;
        text-align: center;
        z-index: 5001;
    }

    .spinner > div {
        width: 18px;
        height: 18px;
        background-color: #fff;

        border-radius: 100%;
        display: inline-block;
        -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
        animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    }

    .spinner .bounce1 {
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
    }

    .spinner .bounce2 {
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
    }

    @-webkit-keyframes sk-bouncedelay {
        0%, 80%, 100% { -webkit-transform: scale(0) }
        40% { -webkit-transform: scale(1.0) }
    }

    @keyframes sk-bouncedelay {
        0%, 80%, 100% {
            -webkit-transform: scale(0);
            transform: scale(0);
        } 40% {
              -webkit-transform: scale(1.0);
              transform: scale(1.0);
          }
    }
</style>