<template>
  <div class="codemirror border">
    <codemirror v-model="localInput" :options="cmOption" @input="issuerInfoChange"></codemirror>
  </div>
</template>

<script>
// require component
import { codemirror } from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css'

// language
import 'codemirror/mode/javascript/javascript.js'

// require active-line.js
import 'codemirror/addon/selection/active-line.js'

// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

// hint
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/javascript-hint.js'

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'

// keyMap
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/search.js'
import 'codemirror/keymap/sublime.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/xml-fold.js'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'codepad',
  components: {
    codemirror
  },
  computed: {
    ...mapState('forge', {
      issuerInfo: state => state.issuerInfo
    })
  },
  methods: {
    ...mapActions('forge',
      [
        'setIssuerInfo'
      ]
    ),
    issuerInfoChange (newInfo) {
      this.setIssuerInfo(newInfo)
    }
  },
  data () {
    return {
      localInput: '',
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        styleSelectedText: true,
        line: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        mode: 'text/javascript',
        hintOptions: {
          completeSingle: false
        },
        readOnly: false,
        keyMap: 'sublime',
        matchBrackets: true,
        showCursorWhenSelecting: true,
        extraKeys: { 'Ctrl': 'autocomplete' }
      }
    }
  },
  created () {
    this.localInput = this.issuerInfo
  },
  watch: {
    issuerInfo: function (newInfo, oldInfo) {
      console.log(newInfo)
      if (this.localInput !== newInfo) {
        this.localInput = newInfo
      }
    }
  }
}
</script>
<style lang="scss">
  .CodeMirror {
    height: auto !important;
  }
  .CodeMirror.border {
    border: 1px solid rgba(0, 0, 0, 0.125);
  }
  .CodeMirror-scroll {
    min-height: 150px
  }
</style>
