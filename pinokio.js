const path = require('path')
const fs = require('fs')

function readSessionUrl() {
  try {
    let p = path.join(__dirname, "session.json")
    if (!fs.existsSync(p)) return null
    let data = JSON.parse(fs.readFileSync(p, "utf-8"))
    return data && data.url ? data.url : null
  } catch (e) {
    return null
  }
}

module.exports = {
  title: "ToonForge Interpolate",
  description: "Cartoon/anime keyframe interpolation for ComfyUI (ToonCrafter-style, via kijai/ComfyUI-DynamiCrafterWrapper), tuned for Apple Silicon (MPS).",
  icon: "icon.png",
  menu: async (kernel) => {
    let installed = fs.existsSync(path.join(__dirname, "ComfyUI", "env"))

    if (!installed) {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Install",
        href: "install.json",
        params: { fullscreen: true, run: true }
      }]
    }

    let running = kernel.running(path.join(__dirname, "start.json"))
    let url = readSessionUrl()

    if (running) {
      let items = [{
        default: true,
        icon: "fa-solid fa-spinner fa-spin",
        text: "Running"
      }, {
        icon: "fa-solid fa-desktop",
        text: "Server",
        href: "start.json",
        params: { fullscreen: true }
      }]
      if (url) {
        items.push({
          icon: "fa-solid fa-rocket",
          text: "Open Web UI",
          href: url,
          target: "_blank"
        })
      }
      items.push({
        icon: "fa-solid fa-rotate",
        text: "Update",
        href: "update.json",
        params: { run: true }
      })
      return items
    }

    return [{
      default: true,
      icon: "fa-solid fa-power-off",
      text: "Launch",
      href: "start.json",
      params: { fullscreen: true, run: true }
    }, {
      icon: "fa-solid fa-rotate",
      text: "Update",
      href: "update.json",
      params: { run: true }
    }, {
      icon: "fa-solid fa-book",
      text: "Read Me (model setup)",
      href: "README.md",
      target: "_blank"
    }]
  }
}
