(function ($) {
  'use strict'

  function mediaPreview(attachment) {
    if (attachment.type === 'image') {
      const source = attachment.sizes?.medium?.url || attachment.url
      return $('<img>', { src: source, alt: attachment.alt || '' })
    }
    return $('<span>', { class: 'spp-file-preview', text: attachment.filename || attachment.url })
  }

  $(document).on('click', '.spp-select-media', function () {
    const control = $(this).closest('.spp-media-control')
    const mime = control.data('mime') || 'image'
    const frame = wp.media({
      title: sppContentAdmin.chooseMedia,
      button: { text: sppContentAdmin.useMedia },
      library: { type: mime },
      multiple: false
    })

    frame.on('select', function () {
      const attachment = frame.state().get('selection').first().toJSON()
      control.find('.spp-media-id').val(attachment.id)
      control.find('.spp-media-preview').empty().append(mediaPreview(attachment))
    })
    frame.open()
  })

  $(document).on('click', '.spp-remove-media', function () {
    const control = $(this).closest('.spp-media-control')
    control.find('.spp-media-id').val('')
    control.find('.spp-media-preview').empty()
  })

  function readStructured(control) {
    try {
      const parsed = JSON.parse(control.find('.spp-structured-json').val() || '[]')
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      return []
    }
  }

  function writeStructured(control, items) {
    const normalized = items.map((item, index) => ({ ...item, order: index }))
    control.find('.spp-structured-json').val(JSON.stringify(normalized))
    renderStructured(control, normalized)
  }

  function renderStructured(control, items) {
    const type = control.data('structured-type')
    const sectionDesignStart = Number(control.data('section-design-start')) || 0
    const target = control.find('.spp-structured-items').empty()
    items.forEach((item, index) => {
      const sectionDesign = index >= sectionDesignStart
      const row = $('<div>', { class: 'spp-structured-item', 'data-index': index })
      $('<strong>', { class: 'spp-structured-number', text: `${index + 1}.` }).appendTo(row)
      const fields = $('<div>', { class: 'spp-structured-copy' }).appendTo(row)
      if (type === 'sections') {
        $('<span>', {
          class: `spp-structured-kind ${sectionDesign ? 'is-added' : 'is-original'}`,
          text: sectionDesign ? sppContentAdmin.addedSection : sppContentAdmin.originalSection
        }).appendTo(fields)
        $('<label>', { text: sppContentAdmin.eyebrow }).append(
          $('<input>', { type: 'text', class: 'widefat spp-structured-eyebrow', value: item.eyebrow || '' })
        ).appendTo(fields)
        $('<label>', { text: sppContentAdmin.heading }).append(
          $('<input>', { type: 'text', class: 'widefat spp-structured-title', value: item.title || '' })
        ).appendTo(fields)
        $('<label>', { text: sppContentAdmin.description }).append(
          $('<textarea>', { class: 'widefat spp-structured-text', rows: 6, text: item.text || '' })
        ).appendTo(fields)
        $('<label>', { text: sppContentAdmin.listItems }).append(
          $('<textarea>', {
            class: 'widefat spp-structured-list',
            rows: 5,
            text: Array.isArray(item.items) ? item.items.map(entry => typeof entry === 'string' ? entry : entry?.text || '').filter(Boolean).join('\n') : (item.items || '')
          })
        ).appendTo(fields)
        if (sectionDesign) {
        const design = $('<div>', { class: 'spp-structured-design' }).appendTo(fields)
        $('<label>', { text: sppContentAdmin.sectionStyle }).append(
          $('<select>', { class: 'widefat spp-structured-style' }).append(
            Object.entries(sppContentAdmin.sectionStyles).map(([value, label]) => $('<option>', { value, text: label, selected: (item.style || 'auto') === value }))
          )
        ).appendTo(design)
        $('<label>', { text: sppContentAdmin.sectionLayout }).append(
          $('<select>', { class: 'widefat spp-structured-layout' }).append(
            Object.entries(sppContentAdmin.sectionLayouts).map(([value, label]) => $('<option>', { value, text: label, selected: (item.layout || 'text') === value }))
          )
        ).appendTo(design)
        const media = $('<div>', { class: 'spp-structured-media' }).appendTo(fields)
        const preview = $('<div>', { class: 'spp-structured-media-preview' }).appendTo(media)
        if (item.preview_url) $('<img>', { src: item.preview_url, alt: item.image_alt || '' }).appendTo(preview)
        $('<button>', { type: 'button', class: 'button spp-structured-select-image', text: item.attachment_id ? sppContentAdmin.replace : sppContentAdmin.chooseSectionImage }).appendTo(media)
        $('<button>', { type: 'button', class: 'button-link-delete spp-structured-remove-image', text: sppContentAdmin.removeImage, disabled: !item.attachment_id }).appendTo(media)
        $('<label>', { text: sppContentAdmin.altText }).append(
          $('<input>', { type: 'text', class: 'widefat spp-structured-image-alt', value: item.image_alt || '' })
        ).appendTo(fields)
        $('<label>', { text: sppContentAdmin.focalPoint }).append(
          $('<input>', { type: 'text', class: 'widefat spp-structured-image-position', value: item.image_position || '50% 50%' })
        ).appendTo(fields)
        }
      } else if (type === 'pairs') {
        $('<label>', { text: sppContentAdmin.heading }).append(
          $('<input>', { type: 'text', class: 'widefat spp-structured-title', value: item.title || '' })
        ).appendTo(fields)
        $('<label>', { text: sppContentAdmin.description }).append(
          $('<textarea>', { class: 'widefat spp-structured-text', rows: 3, text: item.text || '' })
        ).appendTo(fields)
      } else {
        $('<label>', { text: sppContentAdmin.itemText }).append(
          $('<input>', { type: 'text', class: 'widefat spp-structured-text', value: item.text || '' })
        ).appendTo(fields)
      }
      const actions = $('<div>', { class: 'spp-structured-actions' }).appendTo(row)
      $('<button>', { type: 'button', class: 'button spp-structured-up', text: sppContentAdmin.moveUp, disabled: index === 0 }).appendTo(actions)
      $('<button>', { type: 'button', class: 'button spp-structured-down', text: sppContentAdmin.moveDown, disabled: index === items.length - 1 }).appendTo(actions)
      $('<button>', { type: 'button', class: 'button-link-delete spp-structured-remove', text: sppContentAdmin.remove }).appendTo(actions)
      target.append(row)
    })
  }

  $('.spp-structured-control').each(function () {
    const control = $(this)
    renderStructured(control, readStructured(control))
  })

  $(document).on('click', '.spp-add-structured-item', function () {
    const control = $(this).closest('.spp-structured-control')
    const type = control.data('structured-type')
    const items = readStructured(control)
    items.push({
      id: window.crypto?.randomUUID ? window.crypto.randomUUID() : `row-${Date.now()}-${items.length}`,
      ...(type === 'sections' ? { eyebrow: '', title: '', text: '', items: [], style: 'auto', layout: 'text', attachment_id: 0, image_alt: '', image_position: '50% 50%' } : type === 'pairs' ? { title: '', text: '' } : { text: '' }),
      order: items.length
    })
    writeStructured(control, items)
    control.find('.spp-structured-item').last().find('input, textarea').first().trigger('focus')
  })

  $(document).on('input change', '.spp-structured-eyebrow, .spp-structured-title, .spp-structured-text, .spp-structured-list, .spp-structured-style, .spp-structured-layout, .spp-structured-image-alt, .spp-structured-image-position', function () {
    const control = $(this).closest('.spp-structured-control')
    const index = Number($(this).closest('.spp-structured-item').data('index'))
    const items = readStructured(control)
    if (!items[index]) return
    const row = control.find(`.spp-structured-item[data-index="${index}"]`)
    if (control.data('structured-type') !== 'list') items[index].title = row.find('.spp-structured-title').val() || ''
    items[index].text = row.find('.spp-structured-text').val() || ''
    if (control.data('structured-type') === 'sections') {
      items[index].eyebrow = row.find('.spp-structured-eyebrow').val() || ''
      items[index].items = String(row.find('.spp-structured-list').val() || '').split(/\r?\n/).map(value => value.trim()).filter(Boolean)
      if (index >= (Number(control.data('section-design-start')) || 0)) {
        items[index].style = row.find('.spp-structured-style').val() || 'auto'
        items[index].layout = row.find('.spp-structured-layout').val() || 'text'
        items[index].image_alt = row.find('.spp-structured-image-alt').val() || ''
        items[index].image_position = row.find('.spp-structured-image-position').val() || '50% 50%'
      }
    }
    control.find('.spp-structured-json').val(JSON.stringify(items))
  })

  $(document).on('click', '.spp-structured-select-image', function () {
    const control = $(this).closest('.spp-structured-control')
    const index = Number($(this).closest('.spp-structured-item').data('index'))
    const frame = wp.media({
      title: sppContentAdmin.chooseSectionImage,
      button: { text: sppContentAdmin.useMedia },
      library: { type: 'image' },
      multiple: false
    })
    frame.on('select', function () {
      const attachment = frame.state().get('selection').first().toJSON()
      const items = readStructured(control)
      if (!items[index]) return
      items[index].attachment_id = attachment.id
      items[index].preview_url = attachment.sizes?.medium?.url || attachment.url
      if (!items[index].image_alt) items[index].image_alt = attachment.alt || ''
      if ((items[index].layout || 'text') === 'text') items[index].layout = 'image-right'
      writeStructured(control, items)
    })
    frame.open()
  })

  $(document).on('click', '.spp-structured-remove-image', function () {
    const control = $(this).closest('.spp-structured-control')
    const index = Number($(this).closest('.spp-structured-item').data('index'))
    const items = readStructured(control)
    if (!items[index]) return
    items[index].attachment_id = 0
    delete items[index].preview_url
    items[index].layout = 'text'
    writeStructured(control, items)
  })

  $(document).on('click', '.spp-structured-remove, .spp-structured-up, .spp-structured-down', function () {
    const control = $(this).closest('.spp-structured-control')
    const index = Number($(this).closest('.spp-structured-item').data('index'))
    const items = readStructured(control)
    if ($(this).hasClass('spp-structured-remove')) {
      items.splice(index, 1)
    } else {
      const destination = $(this).hasClass('spp-structured-up') ? index - 1 : index + 1
      if (destination < 0 || destination >= items.length) return
      ;[items[index], items[destination]] = [items[destination], items[index]]
    }
    writeStructured(control, items)
  })

  function readGallery(control) {
    try {
      const parsed = JSON.parse(control.find('.spp-gallery-json').val() || '[]')
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      return []
    }
  }

  function writeGallery(control, items) {
    const normalized = items.map((item, index) => ({ ...item, order: index }))
    control.find('.spp-gallery-json').val(JSON.stringify(normalized))
    renderGallery(control, normalized)
  }

  function galleryThumb(item) {
    if (item.type === 'image' && item.preview_url) {
      return $('<img>', { src: item.preview_url, alt: item.alt || '' })
    }
    return $('<span>', {
      class: 'spp-file-preview',
      text: item.filename || (item.type === 'video' ? sppContentAdmin.video : sppContentAdmin.image)
    })
  }

  function renderGallery(control, items) {
    const target = control.find('.spp-gallery-items').empty()
    items.forEach((item, index) => {
      const row = $('<div>', { class: 'spp-gallery-item', 'data-index': index })
      $('<div>', { class: 'spp-gallery-thumb' }).append(galleryThumb(item)).appendTo(row)
      const fields = $('<div>', { class: 'spp-gallery-copy' }).appendTo(row)
      $('<strong>', { text: `${index + 1}. ${item.type === 'video' ? sppContentAdmin.video : sppContentAdmin.image}` }).appendTo(fields)
      $('<label>', { text: sppContentAdmin.altText }).append(
        $('<input>', { type: 'text', class: 'widefat spp-gallery-alt', value: item.alt || '' })
      ).appendTo(fields)
      $('<label>', { text: sppContentAdmin.caption }).append(
        $('<input>', { type: 'text', class: 'widefat spp-gallery-caption', value: item.caption || '' })
      ).appendTo(fields)
      $('<label>', { text: sppContentAdmin.focalPoint }).append(
        $('<input>', { type: 'text', class: 'widefat spp-gallery-position', value: item.object_position || '50% 50%', placeholder: '50% 50%' })
      ).appendTo(fields)
      const actions = $('<div>', { class: 'spp-gallery-actions' }).appendTo(row)
      $('<button>', { type: 'button', class: 'button spp-gallery-replace', text: sppContentAdmin.replace }).appendTo(actions)
      $('<button>', { type: 'button', class: 'button spp-gallery-up', text: sppContentAdmin.moveUp, disabled: index === 0 }).appendTo(actions)
      $('<button>', { type: 'button', class: 'button spp-gallery-down', text: sppContentAdmin.moveDown, disabled: index === items.length - 1 }).appendTo(actions)
      $('<button>', { type: 'button', class: 'button-link-delete spp-gallery-remove', text: sppContentAdmin.remove }).appendTo(actions)
      target.append(row)
    })
  }

  $('.spp-gallery-control').each(function () {
    const control = $(this)
    renderGallery(control, readGallery(control))
  })

  $(document).on('click', '.spp-add-gallery-media', function () {
    const control = $(this).closest('.spp-gallery-control')
    const frame = wp.media({
      title: sppContentAdmin.chooseMedia,
      button: { text: sppContentAdmin.useMedia },
      library: { type: ['image', 'video'] },
      multiple: true
    })

    frame.on('select', function () {
      const items = readGallery(control)
      frame.state().get('selection').each(model => {
        const attachment = model.toJSON()
        if (!['image', 'video'].includes(attachment.type)) return
        items.push({
          id: window.crypto?.randomUUID ? window.crypto.randomUUID() : `media-${attachment.id}-${Date.now()}`,
          type: attachment.type,
          attachment_id: attachment.id,
          poster_attachment_id: 0,
          alt: attachment.alt || attachment.title || '',
          caption: attachment.caption || '',
          object_position: '50% 50%',
          is_placeholder: false,
          preview_url: attachment.sizes?.thumbnail?.url || attachment.icon || attachment.url,
          filename: attachment.filename || '',
          order: items.length
        })
      })
      writeGallery(control, items)
    })
    frame.open()
  })

  $(document).on('input', '.spp-gallery-alt, .spp-gallery-caption, .spp-gallery-position', function () {
    const control = $(this).closest('.spp-gallery-control')
    const index = Number($(this).closest('.spp-gallery-item').data('index'))
    const items = readGallery(control)
    if (!items[index]) return
    items[index].alt = control.find(`.spp-gallery-item[data-index="${index}"] .spp-gallery-alt`).val()
    items[index].caption = control.find(`.spp-gallery-item[data-index="${index}"] .spp-gallery-caption`).val()
    items[index].object_position = control.find(`.spp-gallery-item[data-index="${index}"] .spp-gallery-position`).val() || '50% 50%'
    control.find('.spp-gallery-json').val(JSON.stringify(items))
  })

  $(document).on('click', '.spp-gallery-replace', function () {
    const control = $(this).closest('.spp-gallery-control')
    const index = Number($(this).closest('.spp-gallery-item').data('index'))
    const frame = wp.media({
      title: sppContentAdmin.chooseMedia,
      button: { text: sppContentAdmin.useMedia },
      library: { type: ['image', 'video'] },
      multiple: false
    })
    frame.on('select', function () {
      const attachment = frame.state().get('selection').first().toJSON()
      if (!['image', 'video'].includes(attachment.type)) return
      const items = readGallery(control)
      if (!items[index]) return
      items[index] = {
        ...items[index],
        type: attachment.type,
        attachment_id: attachment.id,
        poster_attachment_id: 0,
        alt: attachment.alt || attachment.title || items[index].alt || '',
        caption: attachment.caption || items[index].caption || '',
        preview_url: attachment.sizes?.thumbnail?.url || attachment.icon || attachment.url,
        filename: attachment.filename || ''
      }
      writeGallery(control, items)
    })
    frame.open()
  })

  $(document).on('click', '.spp-gallery-remove, .spp-gallery-up, .spp-gallery-down', function () {
    const control = $(this).closest('.spp-gallery-control')
    const index = Number($(this).closest('.spp-gallery-item').data('index'))
    const items = readGallery(control)
    if ($(this).hasClass('spp-gallery-remove')) {
      items.splice(index, 1)
    } else {
      const destination = $(this).hasClass('spp-gallery-up') ? index - 1 : index + 1
      if (destination < 0 || destination >= items.length) return
      ;[items[index], items[destination]] = [items[destination], items[index]]
    }
    writeGallery(control, items)
  })
})(jQuery)
