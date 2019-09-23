<template>
  <div id="primary">
    <b-container class="pt-5">
      <h2 class="mb-5">Contributors</h2>
      <b-row>
        <b-col
          v-for="contributor in contributors"
          :key="contributor.name"
          cols="12"
          md="6"
          xl="3"
          class="mb-4"
        >
          <b-card
            no-body
            class="boder-0 shadow h-100"
          >
            <img :src="`/team/${contributor.image}`" class="card-img-top" :alt="`${contributor.name}'s photo`">
            <b-card-body class="text-center">
              <h5 class="card-title mb-0">{{ contributor.name }}</h5>
              <div class="card-text text-black-50">{{ contributor.title }}</div>
              <div class="text-left">
                <a
                  v-if="contributor.github"
                  :href="contributor.github"
                  target="_blank"
                >
                  <font-awesome-icon size="lg" class="align-middle" :icon="faGithub" />
                  <span class="sr-only">Github</span>
                </a>
                <a
                  v-if="contributor.linkedin"
                  :href="contributor.linkedin"
                  target="_blank"
                  :class="contributor.github ? 'ml-3' : ''"
                >
                  <font-awesome-icon size="lg" class="align-middle" :icon="faLinkedin" />
                  <span class="sr-only">Linkedin</span>
                </a>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { BCardBody } from 'bootstrap-vue'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'
export default {
  name: 'Contributors',
  data () {
    return {
      faLinkedin,
      faGithub,
      contributors: [
        {
          name: 'Carl Hua',
          image: 'carl.jpeg',
          title: 'Logos Engineering Lead',
          github: 'https://www.github.com/carlhua',
          linkedin: 'https://www.linkedin.com/in/carl-hua-4b309113/'
        },
        {
          name: 'Carl Hua',
          image: 'carl.jpeg',
          title: 'Logos Engineering Lead',
          github: 'https://www.github.com/carlhua',
          linkedin: 'https://www.linkedin.com/in/carl-hua-4b309113/'
        },
        {
          name: 'Carl Hua',
          image: 'carl.jpeg',
          title: 'Logos Engineering Lead',
          github: 'https://www.github.com/carlhua',
          linkedin: 'https://www.linkedin.com/in/carl-hua-4b309113/'
        },
        {
          name: 'Carl Hua',
          image: 'carl.jpeg',
          title: 'Logos Engineering Lead',
          github: 'https://www.github.com/carlhua',
          linkedin: 'https://www.linkedin.com/in/carl-hua-4b309113/'
        },
        {
          name: 'Carl Hua',
          image: 'carl.jpeg',
          title: 'Logos Engineering Lead',
          github: 'https://www.github.com/carlhua',
          linkedin: 'https://www.linkedin.com/in/carl-hua-4b309113/'
        },
        {
          name: 'Carl Hua',
          image: 'carl.jpeg',
          title: 'Logos Engineering Lead',
          github: 'https://www.github.com/carlhua',
          linkedin: 'https://www.linkedin.com/in/carl-hua-4b309113/'
        },
        {
          name: 'Carl Hua',
          image: 'carl.jpeg',
          title: 'Logos Engineering Lead',
          github: 'https://www.github.com/carlhua',
          linkedin: 'https://www.linkedin.com/in/carl-hua-4b309113/'
        },
        {
          name: 'Carl Hua',
          image: 'carl.jpeg',
          title: 'Logos Engineering Lead',
          github: 'https://www.github.com/carlhua',
          linkedin: 'https://www.linkedin.com/in/carl-hua-4b309113/'
        },
        {
          name: 'Carl Hua',
          image: 'carl.jpeg',
          title: 'Logos Engineering Lead',
          github: 'https://www.github.com/carlhua',
          linkedin: 'https://www.linkedin.com/in/carl-hua-4b309113/'
        },
        {
          name: 'Tyler Storm',
          image: 'tyler.jpg',
          title: 'Full Stack Software Engineer',
          github: 'https://www.github.com/stormtv',
          linkedin: 'https://www.linkedin.com/in/stormtv/'
        }
      ]
    }
  },
  components: {
    BCardBody
  }
}
</script>

<style scoped lang="scss">
</style>
