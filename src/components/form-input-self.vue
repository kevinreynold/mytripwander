<template>
  <div class="login-input">
    <div v-for="input in inputs" class="field-wrap">
      <label>
        {{input.title}}<span class="req">*</span>
      </label>
      <input :type="input.title"/>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  // CUSTOM FORM INPUT LOGIN, etc.
  name: "form-input-self",
  props: {
      inputs: {
        type: Array
      }
  },
  data: () => ({
  }),
  created() {
    $(document).ready(function(){
      $('.login-input').find('input').on('keyup blur focus', function (e) {
        var $this = $(this),
            label = $this.prev('label');

      	  if (e.type === 'keyup') {
      			if ($this.val() === '') {
                label.removeClass('active highlight');
              } else {
                label.addClass('active highlight');
              }
          } else if (e.type === 'blur') {
          	if( $this.val() === '' ) {
          		label.removeClass('active highlight');
      			} else {
      		    label.removeClass('highlight');
      			}
          } else if (e.type === 'focus') {

            if( $this.val() === '' ) {
          		label.removeClass('highlight');
      			}
            else if( $this.val() !== '' ) {
      		    label.addClass('highlight');
      			}
          }
      });
    });
  }
}
</script>

<style scoped>
  .login-input {
    width: 90%;
    margin: auto;
    margin-top: 10%;
  }

  label {
    position: absolute;
    left: 10px;
    -webkit-transform: translateY(6px);
            transform: translateY(6px);
    color: rgba(255, 255, 255, 0.4);
    -webkit-transition: all 0.25s ease;
    transition: all 0.25s ease;
    -webkit-backface-visibility: hidden;
    pointer-events: none;
    font-size: 18px;
  }

  label .req {
    margin: 2px;
    color: #009688;
  }

  label.active {
    -webkit-transform: translateY(-15px);
            transform: translateY(-15px);
    left: 2px;
    font-size: 14px;
  }

  label.active .req {
    opacity: 0;
  }

  label.highlight {
    color: #ffffff;
  }

  input, textarea {
    font-size: 22px;
    display: block;
    width: 96%;
    height: 100%;
    padding: 7px 7px;
    background: none;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid #a0b3b0;
    color: #ffffff;
    border-radius: 0;
    -webkit-transition: border-color .25s ease, box-shadow .25s ease;
    transition: border-color .25s ease, box-shadow .25s ease;
  }

  input:focus {
    outline: 0;
    border-color: #1ab188;
  }

  .field-wrap {
    position: relative;
    margin-bottom: 9%;
  }
</style>
