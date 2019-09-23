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
              <h5 class="card-title">{{ contributor.name }}</h5>
              <div>
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
            <!--
              Also big thanks to Gregory Tsipenyuk, Roger Doss, Kerry Zochowski, Doug Wallace, Joe Alie, Yuliya Belyayeva, Max Chambers, Alex Broudy, and Cole Kennelly.
              Each of these individuals helped us on this Journey.
            -->
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
          name: 'Michael Zochowski',
          image: 'mcz.jpeg',
          title: 'Chief Executive Officer',
          github: 'https://www.github.com/carlhua',
          linkedin: 'https://www.linkedin.com/in/michaelzochowski/'
        },
        {
          name: 'Carl Hua',
          image: 'carl.jpeg',
          title: 'Chief Technical Officer',
          github: 'https://www.github.com/carlhua',
          linkedin: 'https://www.linkedin.com/in/carl-hua-4b309113/'
        },
        {
          name: 'Peng Wang',
          image: 'peng.png',
          title: 'Senior Software Engineer',
          github: 'https://github.com/peng-pl',
          linkedin: 'https://www.linkedin.com/in/peng-wang-087b5223/'
        },
        {
          name: 'Devon White',
          image: 'devon.jpeg',
          title: 'Software Engineer',
          github: 'https://github.com/undertome',
          linkedin: 'https://www.linkedin.com/in/devon-white-95954257/'
        },
        {
          name: 'Shangyan Li',
          image: 'shangyan.jpeg',
          title: 'Software Engineer',
          github: 'https://github.com/ShangyanLi',
          linkedin: 'https://www.linkedin.com/in/shangyan-li-3582456b/'
        },
        {
          name: 'CJ Cobb',
          image: 'cj.jpeg',
          title: 'Software Engineer',
          github: 'https://github.com/cjcobb23',
          linkedin: 'https://www.linkedin.com/in/cj-cobb-57b27b58/'
        },
        {
          name: 'Stephen Gu',
          image: 'stephen.jpeg',
          title: 'Software Engineer',
          github: 'https://github.com/stephengu',
          linkedin: 'https://www.linkedin.com/in/stephengu/'
        },
        {
          name: 'Tyler Storm',
          image: 'tyler.jpg',
          title: 'Full Stack Software Engineer',
          github: 'https://www.github.com/stormtv',
          linkedin: 'https://www.linkedin.com/in/stormtv/'
        },
        {
          name: 'Dmitry Cherukhin',
          image: 'd.jpg',
          title: 'Software Engineer',
          github: 'https://github.com/p2peer'
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
