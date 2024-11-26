<script setup>
import { onMounted, onUnmounted } from 'vue';

    onMounted(() => {
        class Book{
            constructor(width, height, x, y) {
                this.width = width;
                this.height = height;
                this.x = x;
                this.y = y;
                this.maxX = width + x;
                this.maxY = height + y;

            }
            draw(ctx) {
                const xGap = 80;
                const yGap = 60;

                ctx.fillStyle = '#2C3E50';
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.fill();

            }
        }//Book
        class App {
            constructor() {
                this.canvas = document.createElement('canvas');
                this.ctx = this.canvas.getContext('2d');

                document.body.appendChild(this.canvas);

                window.addEventListener('resize', this.resize.bind(this), false);
                this.resize();
                
                this.book = new Book(700, 30, 300, 450);

                window.requestAnimationFrame(this.animate.bind(this));
            }

        resize() {
            this.stageWidth = document.body.clientWidth;
            this.stageHeight = document.body.clientHeight;

            this.canvas.width = this.stageWidth * 1;
            this.canvas.height = this.stageHeight * 1;
            // this.ctx.setTransform(1, 0, 0, 1, 0, 0); // 스케일을 초기화
            this.ctx.scale(1, 1);

        }
        animate() {
            window.requestAnimationFrame(this.animate.bind(this));

            this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
            this.book.draw(this.ctx);
        }

        }// App


        new App();
        
        onUnmounted(() => {
        window.removeEventListener('resize', appInstance.resize);
      });
    }); // onMount
</script>
<template>
    <HeaderMenu/>
    <h1>연습 페이지</h1>
    
    <main>
        
    </main>
</template>

<style scoped>
        
</style>