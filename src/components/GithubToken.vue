<template>
  <div class="container" v-if="!githubTokenExist">
    <form>
      <div class="form-inline">
        <div class="form-group">
          <label for="token">GitHub Token: </label>
          <input type="password" v-model="githubToken" class="form-control" id="token" placeholder="GitHub Token">
          <button type="submit" class="btn btn-primary mb-2" @click="setGithubToken">Add</button>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
    </form>
  </div>
</template>

  <script>
  export default {
    data() {
      return {
        githubToken: '',
      };
    },
    computed: {
      githubTokenExist: {
        get: function get() {
          return this.$store.getters.getGithubToken;
        },
      },
    },
    methods: {
      setGithubToken() {
        console.log('githubToken: ', this.githubToken);
        this.$store.dispatch('setGithubToken', this.githubToken);
      },
    },
  };
</script>
